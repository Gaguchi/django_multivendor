from django.core.management.base import BaseCommand
from django.utils import timezone
from orders.models import Order
from payouts.models import VendorPayout, PayoutProcessingLog
from vendors.models import Vendor

class Command(BaseCommand):
    help = 'Process pending payouts for delivered orders'

    def add_arguments(self, parser):
        parser.add_argument(
            '--vendor_id',
            type=int,
            help='Process payouts for specific vendor',
            required=False
        )

    def handle(self, *args, **kwargs):
        vendor_id = kwargs.get('vendor_id')
        
        # Base query for delivered orders pending payment
        query = Order.objects.filter(
            status='Delivered',
            payment_clearance_status='Pending',
            delivered_at__isnull=False,
            dispute_raised_at__isnull=True
        )

        # Add vendor filter if specified
        if vendor_id:
            query = query.filter(items__product__vendor_id=vendor_id).distinct()
            vendors = [Vendor.objects.get(id=vendor_id)]
        else:
            # Process all vendors
            vendors = Vendor.objects.all()

        for vendor in vendors:
            processed_orders = 0
            total_amount = 0

            # Process orders for this vendor
            vendor_orders = query.filter(items__product__vendor=vendor).distinct()
            
            for order in vendor_orders:
                if order.is_ready_for_clearance:
                    # Create payout record
                    payout = VendorPayout.objects.create(
                        vendor=vendor,
                        amount=order.total_amount,
                        status='Pending'
                    )
                    
                    # Clear the payment
                    order.clear_payment()
                    
                    processed_orders += 1
                    total_amount += order.total_amount

            # Create processing log
            PayoutProcessingLog.objects.create(
                vendor=vendor,
                processed_orders=processed_orders,
                total_amount_processed=total_amount
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Processed {processed_orders} orders for vendor {vendor.store_name}'
                )
            )

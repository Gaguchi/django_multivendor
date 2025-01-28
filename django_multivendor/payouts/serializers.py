from rest_framework import serializers
from .models import VendorPayout
from vendors.models import Vendor

class VendorPayoutSerializer(serializers.ModelSerializer):
    vendor_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = VendorPayout
        fields = [
            'id', 'vendor', 'vendor_id', 'amount', 'status',
            'requested_at', 'paid_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['vendor', 'created_at', 'updated_at']

    def validate_vendor_id(self, value):
        try:
            vendor = Vendor.objects.get(id=value)
            return value
        except Vendor.DoesNotExist:
            raise serializers.ValidationError("Invalid vendor")

    def create(self, validated_data):
        vendor_id = validated_data.pop('vendor_id')
        vendor = Vendor.objects.get(id=vendor_id)
        return VendorPayout.objects.create(vendor=vendor, **validated_data)

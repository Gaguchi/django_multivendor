from django.core.management.base import BaseCommand
from categories.models import Category
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Seed the database with comprehensive hierarchical categories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing categories before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing categories...')
            Category.objects.all().delete()

        self.stdout.write('Creating comprehensive category hierarchy...')
        
        # Define the category structure
        categories_data = {
            "Electronics": {
                "order": 1,
                "subcategories": {
                    "Smartphones & Tablets": {
                        "order": 1,
                        "subcategories": {
                            "Smartphones": {"order": 1},
                            "Tablets": {"order": 2},
                            "Smartwatches": {"order": 3},
                            "Phone Accessories": {"order": 4},
                            "Screen Protectors": {"order": 5}
                        }
                    },
                    "Computers & Laptops": {
                        "order": 2,
                        "subcategories": {
                            "Laptops": {"order": 1},
                            "Desktop Computers": {"order": 2},
                            "Gaming PCs": {"order": 3},
                            "Computer Accessories": {"order": 4},
                            "Monitors": {"order": 5},
                            "Keyboards & Mice": {"order": 6}
                        }
                    },
                    "Audio & Video": {
                        "order": 3,
                        "subcategories": {
                            "Headphones": {"order": 1},
                            "Speakers": {"order": 2},
                            "Smart TVs": {"order": 3},
                            "Sound Systems": {"order": 4},
                            "Cameras": {"order": 5},
                            "Gaming Headsets": {"order": 6}
                        }
                    },
                    "Gaming": {
                        "order": 4,
                        "subcategories": {
                            "Gaming Consoles": {"order": 1},
                            "Video Games": {"order": 2},
                            "Gaming Accessories": {"order": 3},
                            "Gaming Chairs": {"order": 4},
                            "VR Headsets": {"order": 5}
                        }
                    }
                }
            },
            "Fashion & Clothing": {
                "order": 2,
                "subcategories": {
                    "Women's Fashion": {
                        "order": 1,
                        "subcategories": {
                            "Dresses": {"order": 1},
                            "Tops & Blouses": {"order": 2},
                            "Pants & Jeans": {"order": 3},
                            "Skirts": {"order": 4},
                            "Lingerie": {"order": 5},
                            "Activewear": {"order": 6}
                        }
                    },
                    "Men's Fashion": {
                        "order": 2,
                        "subcategories": {
                            "Shirts": {"order": 1},
                            "T-Shirts & Polos": {"order": 2},
                            "Pants & Jeans": {"order": 3},
                            "Suits & Blazers": {"order": 4},
                            "Underwear": {"order": 5},
                            "Activewear": {"order": 6}
                        }
                    },
                    "Shoes": {
                        "order": 3,
                        "subcategories": {
                            "Women's Shoes": {"order": 1},
                            "Men's Shoes": {"order": 2},
                            "Sneakers": {"order": 3},
                            "Boots": {"order": 4},
                            "Sandals": {"order": 5},
                            "Formal Shoes": {"order": 6}
                        }
                    },
                    "Accessories": {
                        "order": 4,
                        "subcategories": {
                            "Jewelry": {"order": 1},
                            "Watches": {"order": 2},
                            "Bags & Handbags": {"order": 3},
                            "Sunglasses": {"order": 4},
                            "Belts": {"order": 5},
                            "Scarves": {"order": 6}
                        }
                    }
                }
            },
            "Home & Garden": {
                "order": 3,
                "subcategories": {
                    "Furniture": {
                        "order": 1,
                        "subcategories": {
                            "Living Room": {"order": 1},
                            "Bedroom": {"order": 2},
                            "Dining Room": {"order": 3},
                            "Office Furniture": {"order": 4},
                            "Outdoor Furniture": {"order": 5}
                        }
                    },
                    "Home Décor": {
                        "order": 2,
                        "subcategories": {
                            "Wall Art": {"order": 1},
                            "Lighting": {"order": 2},
                            "Rugs & Carpets": {"order": 3},
                            "Curtains & Blinds": {"order": 4},
                            "Candles & Holders": {"order": 5}
                        }
                    },
                    "Kitchen & Dining": {
                        "order": 3,
                        "subcategories": {
                            "Cookware": {"order": 1},
                            "Kitchen Appliances": {"order": 2},
                            "Dinnerware": {"order": 3},
                            "Kitchen Tools": {"order": 4},
                            "Storage & Organization": {"order": 5}
                        }
                    },
                    "Garden & Outdoor": {
                        "order": 4,
                        "subcategories": {
                            "Garden Tools": {"order": 1},
                            "Plants & Seeds": {"order": 2},
                            "Outdoor Lighting": {"order": 3},
                            "BBQ & Grilling": {"order": 4},
                            "Pool & Spa": {"order": 5}
                        }
                    }
                }
            },
            "Health & Beauty": {
                "order": 4,
                "subcategories": {
                    "Skincare": {
                        "order": 1,
                        "subcategories": {
                            "Face Care": {"order": 1},
                            "Body Care": {"order": 2},
                            "Sun Care": {"order": 3},
                            "Anti-Aging": {"order": 4},
                            "Moisturizers": {"order": 5}
                        }
                    },
                    "Makeup": {
                        "order": 2,
                        "subcategories": {
                            "Face Makeup": {"order": 1},
                            "Eye Makeup": {"order": 2},
                            "Lip Makeup": {"order": 3},
                            "Makeup Tools": {"order": 4},
                            "Nail Care": {"order": 5}
                        }
                    },
                    "Hair Care": {
                        "order": 3,
                        "subcategories": {
                            "Shampoo & Conditioner": {"order": 1},
                            "Hair Styling": {"order": 2},
                            "Hair Tools": {"order": 3},
                            "Hair Extensions": {"order": 4},
                            "Hair Color": {"order": 5}
                        }
                    },
                    "Health & Wellness": {
                        "order": 4,
                        "subcategories": {
                            "Vitamins & Supplements": {"order": 1},
                            "Fitness Equipment": {"order": 2},
                            "Personal Care": {"order": 3},
                            "Medical Supplies": {"order": 4},
                            "Weight Management": {"order": 5}
                        }
                    }
                }
            },
            "Sports & Outdoors": {
                "order": 5,
                "subcategories": {
                    "Exercise & Fitness": {
                        "order": 1,
                        "subcategories": {
                            "Cardio Equipment": {"order": 1},
                            "Strength Training": {"order": 2},
                            "Yoga & Pilates": {"order": 3},
                            "Fitness Accessories": {"order": 4},
                            "Sports Nutrition": {"order": 5}
                        }
                    },
                    "Outdoor Sports": {
                        "order": 2,
                        "subcategories": {
                            "Cycling": {"order": 1},
                            "Running": {"order": 2},
                            "Hiking & Camping": {"order": 3},
                            "Water Sports": {"order": 4},
                            "Winter Sports": {"order": 5}
                        }
                    },
                    "Team Sports": {
                        "order": 3,
                        "subcategories": {
                            "Football": {"order": 1},
                            "Basketball": {"order": 2},
                            "Soccer": {"order": 3},
                            "Baseball": {"order": 4},
                            "Tennis": {"order": 5}
                        }
                    },
                    "Sportswear": {
                        "order": 4,
                        "subcategories": {
                            "Athletic Shoes": {"order": 1},
                            "Activewear": {"order": 2},
                            "Sports Underwear": {"order": 3},
                            "Sports Accessories": {"order": 4},
                            "Team Apparel": {"order": 5}
                        }
                    }
                }
            },
            "Books & Media": {
                "order": 6,
                "subcategories": {
                    "Books": {
                        "order": 1,
                        "subcategories": {
                            "Fiction": {"order": 1},
                            "Non-Fiction": {"order": 2},
                            "Educational": {"order": 3},
                            "Children's Books": {"order": 4},
                            "E-Books": {"order": 5}
                        }
                    },
                    "Movies & TV": {
                        "order": 2,
                        "subcategories": {
                            "DVDs & Blu-ray": {"order": 1},
                            "Digital Movies": {"order": 2},
                            "TV Series": {"order": 3},
                            "Documentaries": {"order": 4}
                        }
                    },
                    "Music": {
                        "order": 3,
                        "subcategories": {
                            "CDs": {"order": 1},
                            "Vinyl Records": {"order": 2},
                            "Digital Music": {"order": 3},
                            "Musical Instruments": {"order": 4}
                        }
                    }
                }
            },
            "Toys & Games": {
                "order": 7,
                "subcategories": {
                    "Children's Toys": {
                        "order": 1,
                        "subcategories": {
                            "Action Figures": {"order": 1},
                            "Dolls & Accessories": {"order": 2},
                            "Educational Toys": {"order": 3},
                            "Building Blocks": {"order": 4},
                            "Remote Control Toys": {"order": 5}
                        }
                    },
                    "Board Games": {
                        "order": 2,
                        "subcategories": {
                            "Strategy Games": {"order": 1},
                            "Family Games": {"order": 2},
                            "Card Games": {"order": 3},
                            "Puzzle Games": {"order": 4}
                        }
                    },
                    "Outdoor Toys": {
                        "order": 3,
                        "subcategories": {
                            "Bikes & Scooters": {"order": 1},
                            "Sports Toys": {"order": 2},
                            "Water Toys": {"order": 3},
                            "Playground Equipment": {"order": 4}
                        }
                    }
                }
            },
            "Automotive": {
                "order": 8,
                "subcategories": {
                    "Car Accessories": {
                        "order": 1,
                        "subcategories": {
                            "Interior Accessories": {"order": 1},
                            "Exterior Accessories": {"order": 2},
                            "Electronics": {"order": 3},
                            "Cleaning Supplies": {"order": 4}
                        }
                    },
                    "Car Parts": {
                        "order": 2,
                        "subcategories": {
                            "Engine Parts": {"order": 1},
                            "Brake Parts": {"order": 2},
                            "Suspension": {"order": 3},
                            "Tires & Wheels": {"order": 4}
                        }
                    },
                    "Motorcycle": {
                        "order": 3,
                        "subcategories": {
                            "Motorcycle Parts": {"order": 1},
                            "Motorcycle Accessories": {"order": 2},
                            "Safety Gear": {"order": 3}
                        }
                    }
                }
            }
        }

        # Create categories recursively
        def create_category(name, data, parent=None):
            # Create unique slug
            base_slug = slugify(name)
            slug = base_slug
            counter = 1
            
            # Ensure unique slug
            while Category.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            category = Category.objects.create(
                name=name,
                slug=slug,
                parent_category=parent,
                display_order=data.get('order', 999)
            )
            self.stdout.write(f'Created: {category.name} (slug: {category.slug})')
            
            # Create subcategories if they exist
            if 'subcategories' in data:
                for sub_name, sub_data in data['subcategories'].items():
                    create_category(sub_name, sub_data, category)
            
            return category

        # Create all categories
        for category_name, category_data in categories_data.items():
            create_category(category_name, category_data)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {Category.objects.count()} categories'
            )
        )
        
        # Display the hierarchy
        self.stdout.write('\nCategory Hierarchy:')
        root_categories = Category.objects.filter(parent_category=None).order_by('display_order')
        
        def display_hierarchy(categories, indent=0):
            for category in categories:
                self.stdout.write('  ' * indent + f'- {category.name}')
                children = category.subcategories.order_by('display_order')
                if children.exists():
                    display_hierarchy(children, indent + 1)
        
        display_hierarchy(root_categories)

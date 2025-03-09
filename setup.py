from setuptools import setup, find_packages

setup(
    name="django_multivendor",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "Django>=4.2,<5.0",
        "djangorestframework>=3.14.0",
        "djangorestframework-simplejwt>=5.2.2",
        "django-cors-headers>=4.0.0",
        "social-auth-app-django>=5.2.0",
        "django-extensions>=3.2.0",
        "PyJWT>=2.6.0",
        "pillow>=9.5.0",
        "requests>=2.28.2",
    ],
    scripts=["init_database.bat"],
    author="MultiVendor Team",
    author_email="info@example.com",
    description="A Django multivendor e-commerce platform",
    keywords="django, ecommerce, multivendor",
    python_requires=">=3.8",
)

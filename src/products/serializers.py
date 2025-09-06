from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'user', 'name', 'url', 'target_price', 'current_price', 'last_checked', 'created_at']
        read_only_fields = ['user', 'current_price', 'created_at', 'last_checked']
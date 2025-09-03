from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'url', 'target_price', 'current_price', 'created_at']
        read_only_fields = ['current_price', 'created_at']
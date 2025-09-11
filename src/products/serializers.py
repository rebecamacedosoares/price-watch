from rest_framework import serializers
from .models import Product, PriceHistory

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'user', 'name', 'url', 'target_price', 'current_price', 'last_checked', 'created_at']
        read_only_fields = ['user', 'current_price', 'created_at', 'last_checked']

    def validate(self, data):
        user = self.context['request'].user
        if Product.objects.filter(user=user, url=data['url']).exists():
            raise serializers.ValidationError("Você já está monitorando um produto com esta URL.")
        return data

class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['price', 'created_at']
# src/products/views.py
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite visualizar e editar produtos.
    """
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
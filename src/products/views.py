from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from django.contrib.auth.models import User

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite visualizar e editar produtos.
    """
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        user = User.objects.first()
        serializer.save(user=user)
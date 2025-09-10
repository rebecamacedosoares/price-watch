from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    
    path('auth/jwt/create/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/', include('djoser.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'products/static')
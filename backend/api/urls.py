
from django.urls import path
from .views import CoordinatesView

urlpatterns = [
    path('coordinates/', CoordinatesView.as_view(), name='coordinates'),
]

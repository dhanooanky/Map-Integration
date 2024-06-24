
from rest_framework import serializers

class CoordinatesSerializer(serializers.Serializer):
    northEast = serializers.DictField()
    southWest = serializers.DictField()

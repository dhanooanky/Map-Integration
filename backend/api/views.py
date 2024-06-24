
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CoordinatesSerializer
from django.conf import settings
import geemap

class CoordinatesView(APIView):
    def post(self, request):
        serializer = CoordinatesSerializer(data=request.data)
        if serializer.is_valid():
            north_east = serializer.validated_data['northEast']
            south_west = serializer.validated_data['southWest']
   
            bbox = [south_west['lng'], south_west['lat'], north_east['lng'], north_east['lat']]

  
            output_path = '/tmp/output_image.png'
            try:
                Map = geemap.Map()
                Map.to_image(bbox=bbox, output=output_path, zoom=10, crs='EPSG:3857')
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

           
            with open(output_path, 'rb') as img:
                response = Response(img.read(), content_type='image/png')
                response['Content-Disposition'] = f'attachment; filename="image.png"'
                return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

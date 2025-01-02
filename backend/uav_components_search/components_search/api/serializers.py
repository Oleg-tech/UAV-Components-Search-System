from rest_framework import serializers


class ComponentSerializer(serializers.Serializer):
    componentName = serializers.CharField()
    componentPrice = serializers.CharField()
    componentImageURL = serializers.URLField()
    componentExternalURL = serializers.URLField()
    componentShopName = serializers.CharField(default=None)
    componentCountry = serializers.CharField(default=None)
    company = serializers.CharField(default=None)
    parameters = serializers.CharField(default=None)

from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('components/', include('components_search.urls')),
    path('admin/', admin.site.urls),
]

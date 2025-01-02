from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    index, FindComponentView, DownloadComponentView,
    AdminComponentFileView, SuperUserLoginView, FindByCategoryView,
    SaveUserMessageView, AdminUserMessageView
)


urlpatterns = [
    path('', index),
    path('api/search/', FindComponentView.as_view(), name='components-search'),
    path('api/search/download', DownloadComponentView.as_view(), name='components-search-download'),
    path('api/categories', FindByCategoryView.as_view(), name='components-search-category'),
    path('api/admin', AdminComponentFileView.as_view(), name='components-admin'),
    path('api/admin/check_messages', AdminUserMessageView.as_view(), name='components-admin-check-messages'),
    path('api/login', SuperUserLoginView.as_view(), name='components-admin-login'),
    path('api/report_problem', SaveUserMessageView.as_view(), name='components-report-problem'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

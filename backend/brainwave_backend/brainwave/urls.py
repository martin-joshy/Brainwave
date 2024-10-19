from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/user-auth/", include("user_auth.urls")),
    path("api/notebook-manage/", include("notebook_management.urls")),
    path("api/admin/user-manage/", include("admin_user_manage.urls")),
    path("api/collab-editor/", include("collab_editor.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

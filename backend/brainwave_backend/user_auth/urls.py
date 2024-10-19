from dj_rest_auth.registration.views import (
    RegisterView,
    VerifyEmailView,
    ConfirmEmailView,
    ResendEmailVerificationView,
)
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView, LogoutView
from dj_rest_auth.jwt_auth import get_refresh_view

from django.urls import path, re_path
from .views import (
    GoogleLogin,
    CustomLoginView,
    ValidatePasswordView,
    ValidateUsernameView,
    UploadCroppedImageView,
    UserProfileView,
)

urlpatterns = [
    path("account-confirm-email/<str:key>/", ConfirmEmailView.as_view()),
    path("register/", RegisterView.as_view()),
    path("login/", CustomLoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("google/", GoogleLogin.as_view(), name="google_login"),
    path("verify-email/", VerifyEmailView.as_view(), name="rest_verify_email"),
    path(
        "resend-email/", ResendEmailVerificationView.as_view(), name="rest_resend_email"
    ),
    path(
        "account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    re_path(
        r"^account-confirm-email/(?P<key>[-:\w]+)/$",
        VerifyEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("password-reset/", PasswordResetView.as_view()),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "validate-password/", ValidatePasswordView.as_view(), name="validate_password"
    ),
    path(
        "validate-username/", ValidateUsernameView.as_view(), name="validate_username"
    ),
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path(
        "upload-cropped-image/",
        UploadCroppedImageView.as_view(),
        name="upload_cropped_image",
    ),
    path("user-profile/", UserProfileView.as_view(), name="user-profile"),
]

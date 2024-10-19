from django.apps import AppConfig


class CollabEditorConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "collab_editor"

    def ready(self):
        import collab_editor.signals

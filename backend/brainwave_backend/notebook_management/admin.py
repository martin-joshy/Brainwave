from django.contrib import admin
from .models import Notebook, NotebookSubtopic, NotebookTopic

admin.site.register(Notebook)
admin.site.register(NotebookSubtopic)
admin.site.register(NotebookTopic)

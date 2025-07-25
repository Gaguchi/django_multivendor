# Generated by Django 4.2.5 on 2025-07-22 10:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('vendors', '0010_vendorproduct_tags'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('last_message_text', models.TextField(blank=True, null=True)),
                ('last_message_timestamp', models.DateTimeField(blank=True, null=True)),
                ('last_message_sender_type', models.CharField(blank=True, choices=[('customer', 'Customer'), ('vendor', 'Vendor')], max_length=10, null=True)),
                ('unread_by_customer', models.IntegerField(default=0)),
                ('unread_by_vendor', models.IntegerField(default=0)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_chats', to=settings.AUTH_USER_MODEL)),
                ('vendor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vendor_chats', to='vendors.vendor')),
            ],
            options={
                'ordering': ['-updated_at'],
                'unique_together': {('customer', 'vendor')},
            },
        ),
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sender_type', models.CharField(choices=[('customer', 'Customer'), ('vendor', 'Vendor'), ('system', 'System')], max_length=10)),
                ('content', models.TextField()),
                ('message_type', models.CharField(choices=[('text', 'Text'), ('image', 'Image'), ('file', 'File'), ('system', 'System Message')], default='text', max_length=10)),
                ('attachment', models.FileField(blank=True, null=True, upload_to='chat_attachments/')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('chat_room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='chat.chatroom')),
                ('sender_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('sender_vendor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='vendors.vendor')),
            ],
            options={
                'ordering': ['timestamp'],
            },
        ),
        migrations.CreateModel(
            name='ChatParticipant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('participant_type', models.CharField(choices=[('customer', 'Customer'), ('vendor', 'Vendor')], max_length=10)),
                ('last_seen', models.DateTimeField(auto_now=True)),
                ('is_online', models.BooleanField(default=False)),
                ('is_typing', models.BooleanField(default=False)),
                ('typing_timestamp', models.DateTimeField(blank=True, null=True)),
                ('chat_room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='chat.chatroom')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('vendor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='vendors.vendor')),
            ],
            options={
                'unique_together': {('chat_room', 'user', 'vendor')},
            },
        ),
    ]

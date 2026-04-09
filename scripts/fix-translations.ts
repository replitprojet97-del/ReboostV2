import * as fs from 'fs';
import * as path from 'path';

const settingsMessagesTranslations = {
  en: {
    profileUpdated: 'Profile updated',
    profileUpdatedDesc: 'Your information has been successfully saved.',
    preferencesUpdated: 'Preferences saved',
    preferencesUpdatedDesc: 'Your notification preferences have been updated.',
    passwordChanged: 'Password changed',
    passwordChangedDesc: 'Your password has been successfully changed.',
    passwordMismatch: 'Passwords do not match',
    errorUpdatingProfile: 'Error updating profile',
    errorUpdatingPreferences: 'Error updating preferences',
    errorChangingPassword: 'Error changing password',
    avatarUpdated: 'Profile picture updated',
    avatarUpdatedDesc: 'Your profile picture has been successfully updated.',
    errorUploadingAvatar: 'Error uploading picture',
    invalidFileType: 'File type not allowed. Only JPEG, PNG and WebP images are accepted.',
    fileTooLarge: 'File is too large (max 5MB).',
  },
  es: {
    profileUpdated: 'Perfil actualizado',
    profileUpdatedDesc: 'Tu información ha sido guardada con éxito.',
    preferencesUpdated: 'Preferencias guardadas',
    preferencesUpdatedDesc: 'Tus preferencias de notificación han sido actualizadas.',
    passwordChanged: 'Contraseña cambiada',
    passwordChangedDesc: 'Tu contraseña ha sido cambiada con éxito.',
    passwordMismatch: 'Las contraseñas no coinciden',
    errorUpdatingProfile: 'Error al actualizar el perfil',
    errorUpdatingPreferences: 'Error al actualizar las preferencias',
    errorChangingPassword: 'Error al cambiar la contraseña',
    avatarUpdated: 'Foto de perfil actualizada',
    avatarUpdatedDesc: 'Tu foto de perfil ha sido actualizada con éxito.',
    errorUploadingAvatar: 'Error al subir la foto',
    invalidFileType: 'Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG y WebP.',
    fileTooLarge: 'El archivo es demasiado grande (máx 5MB).',
  },
  pt: {
    profileUpdated: 'Perfil atualizado',
    profileUpdatedDesc: 'Suas informações foram salvas com sucesso.',
    preferencesUpdated: 'Preferências salvas',
    preferencesUpdatedDesc: 'Suas preferências de notificação foram atualizadas.',
    passwordChanged: 'Senha alterada',
    passwordChangedDesc: 'Sua senha foi alterada com sucesso.',
    passwordMismatch: 'As senhas não correspondem',
    errorUpdatingProfile: 'Erro ao atualizar o perfil',
    errorUpdatingPreferences: 'Erro ao atualizar as preferências',
    errorChangingPassword: 'Erro ao alterar a senha',
    avatarUpdated: 'Foto de perfil atualizada',
    avatarUpdatedDesc: 'Sua foto de perfil foi atualizada com sucesso.',
    errorUploadingAvatar: 'Erro ao fazer upload da foto',
    invalidFileType: 'Tipo de arquivo não permitido. Apenas imagens JPEG, PNG e WebP são aceitas.',
    fileTooLarge: 'O arquivo é muito grande (máx 5MB).',
  },
  it: {
    profileUpdated: 'Profilo aggiornato',
    profileUpdatedDesc: 'Le tue informazioni sono state salvate con successo.',
    preferencesUpdated: 'Preferenze salvate',
    preferencesUpdatedDesc: 'Le tue preferenze di notifica sono state aggiornate.',
    passwordChanged: 'Password cambiata',
    passwordChangedDesc: 'La tua password è stata cambiata con successo.',
    passwordMismatch: 'Le password non corrispondono',
    errorUpdatingProfile: 'Errore durante l\'aggiornamento del profilo',
    errorUpdatingPreferences: 'Errore durante l\'aggiornamento delle preferenze',
    errorChangingPassword: 'Errore durante il cambio della password',
    avatarUpdated: 'Foto del profilo aggiornata',
    avatarUpdatedDesc: 'La tua foto del profilo è stata aggiornata con successo.',
    errorUploadingAvatar: 'Errore durante il caricamento della foto',
    invalidFileType: 'Tipo di file non consentito. Sono accettate solo immagini JPEG, PNG e WebP.',
    fileTooLarge: 'Il file è troppo grande (max 5MB).',
  },
  de: {
    profileUpdated: 'Profil aktualisiert',
    profileUpdatedDesc: 'Ihre Informationen wurden erfolgreich gespeichert.',
    preferencesUpdated: 'Einstellungen gespeichert',
    preferencesUpdatedDesc: 'Ihre Benachrichtigungseinstellungen wurden aktualisiert.',
    passwordChanged: 'Passwort geändert',
    passwordChangedDesc: 'Ihr Passwort wurde erfolgreich geändert.',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    errorUpdatingProfile: 'Fehler beim Aktualisieren des Profils',
    errorUpdatingPreferences: 'Fehler beim Aktualisieren der Einstellungen',
    errorChangingPassword: 'Fehler beim Ändern des Passworts',
    avatarUpdated: 'Profilbild aktualisiert',
    avatarUpdatedDesc: 'Ihr Profilbild wurde erfolgreich aktualisiert.',
    errorUploadingAvatar: 'Fehler beim Hochladen des Bildes',
    invalidFileType: 'Dateityp nicht zulässig. Nur JPEG-, PNG- und WebP-Bilder werden akzeptiert.',
    fileTooLarge: 'Die Datei ist zu groß (max 5MB).',
  },
  nl: {
    profileUpdated: 'Profiel bijgewerkt',
    profileUpdatedDesc: 'Uw informatie is succesvol opgeslagen.',
    preferencesUpdated: 'Voorkeuren opgeslagen',
    preferencesUpdatedDesc: 'Uw meldingsvoorkeuren zijn bijgewerkt.',
    passwordChanged: 'Wachtwoord gewijzigd',
    passwordChangedDesc: 'Uw wachtwoord is succesvol gewijzigd.',
    passwordMismatch: 'Wachtwoorden komen niet overeen',
    errorUpdatingProfile: 'Fout bij het bijwerken van het profiel',
    errorUpdatingPreferences: 'Fout bij het bijwerken van voorkeuren',
    errorChangingPassword: 'Fout bij het wijzigen van het wachtwoord',
    avatarUpdated: 'Profielfoto bijgewerkt',
    avatarUpdatedDesc: 'Uw profielfoto is succesvol bijgewerkt.',
    errorUploadingAvatar: 'Fout bij het uploaden van de foto',
    invalidFileType: 'Bestandstype niet toegestaan. Alleen JPEG-, PNG- en WebP-afbeeldingen worden geaccepteerd.',
    fileTooLarge: 'Het bestand is te groot (max 5MB).',
  },
};

function formatSettingsMessages(lang: string): string {
  const msgs = settingsMessagesTranslations[lang as keyof typeof settingsMessagesTranslations];
  return `    settingsMessages: {
      profileUpdated: '${msgs.profileUpdated}',
      profileUpdatedDesc: '${msgs.profileUpdatedDesc}',
      preferencesUpdated: '${msgs.preferencesUpdated}',
      preferencesUpdatedDesc: '${msgs.preferencesUpdatedDesc}',
      passwordChanged: '${msgs.passwordChanged}',
      passwordChangedDesc: '${msgs.passwordChangedDesc}',
      passwordMismatch: '${msgs.passwordMismatch}',
      errorUpdatingProfile: '${msgs.errorUpdatingProfile}',
      errorUpdatingPreferences: '${msgs.errorUpdatingPreferences}',
      errorChangingPassword: '${msgs.errorChangingPassword}',
      avatarUpdated: '${msgs.avatarUpdated}',
      avatarUpdatedDesc: '${msgs.avatarUpdatedDesc}',
      errorUploadingAvatar: '${msgs.errorUploadingAvatar}',
      invalidFileType: '${msgs.invalidFileType}',
      fileTooLarge: '${msgs.fileTooLarge}',
    },`;
}

function addNavMessages(lang: string): string {
  const navMessages = {
    en: 'messages: \'Messages\',',
    es: 'messages: \'Mensajes\',',
    pt: 'messages: \'Mensagens\',',
    it: 'messages: \'Messaggi\',',
    de: 'messages: \'Nachrichten\',',
    nl: 'messages: \'Berichten\',',
  };
  return navMessages[lang as keyof typeof navMessages] || '';
}

console.log('Script ready to fix translations');
console.log('\nSettings Messages for EN:');
console.log(formatSettingsMessages('en'));
console.log('\nSettings Messages for ES:');
console.log(formatSettingsMessages('es'));
console.log('\nNav Messages:');
console.log('EN:', addNavMessages('en'));
console.log('ES:', addNavMessages('es'));

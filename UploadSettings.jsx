import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UploadSettings = ({ settings, onSettingsChange, isVisible, onToggle }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const folderOptions = [
    { value: 'root', label: 'Cartella Principale' },
    { value: 'documents', label: 'Documenti' },
    { value: 'downloads', label: 'Download' },
    { value: 'images', label: 'Immagini' },
    { value: 'videos', label: 'Video' },
    { value: 'music', label: 'Musica' },
    { value: 'documents/work', label: 'Documenti/Lavoro' },
    { value: 'documents/personal', label: 'Documenti/Personale' },
  ];

  const qualityOptions = [
    { value: 'original', label: 'Qualità Originale' },
    { value: 'high', label: 'Alta Qualità' },
    { value: 'medium', label: 'Media Qualità' },
    { value: 'low', label: 'Bassa Qualità' },
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleApplySettings = () => {
    onSettingsChange(localSettings);
    onToggle();
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      targetFolder: 'root',
      overwriteExisting: false,
      createBackup: true,
      compressImages: false,
      imageQuality: 'original',
      autoRename: true,
      preserveStructure: false,
      maxFileSize: 100,
      allowedTypes: ['pdf', 'txt', 'log', 'exe', 'mp3', 'mp4', 'jpg', 'jpeg', 'png', 'gif'],
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        iconName="Settings"
        iconPosition="left"
        onClick={onToggle}
        className="mb-4"
      >
        Impostazioni Caricamento
      </Button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Impostazioni Caricamento</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Folder */}
        <div className="space-y-2">
          <Select
            label="Cartella di Destinazione"
            options={folderOptions}
            value={localSettings?.targetFolder}
            onChange={(value) => handleSettingChange('targetFolder', value)}
          />
        </div>

        {/* Max File Size */}
        <div className="space-y-2">
          <Select
            label="Dimensione Massima File (MB)"
            options={[
              { value: 10, label: '10 MB' },
              { value: 50, label: '50 MB' },
              { value: 100, label: '100 MB' },
              { value: 500, label: '500 MB' },
              { value: 1000, label: '1 GB' },
            ]}
            value={localSettings?.maxFileSize}
            onChange={(value) => handleSettingChange('maxFileSize', value)}
          />
        </div>
      </div>
      {/* File Handling Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Gestione File</h4>
        
        <Checkbox
          label="Sovrascrivi file esistenti"
          description="Sostituisce automaticamente i file con lo stesso nome"
          checked={localSettings?.overwriteExisting}
          onChange={(e) => handleSettingChange('overwriteExisting', e?.target?.checked)}
        />

        <Checkbox
          label="Crea backup prima della sostituzione"
          description="Mantiene una copia del file originale"
          checked={localSettings?.createBackup}
          onChange={(e) => handleSettingChange('createBackup', e?.target?.checked)}
          disabled={!localSettings?.overwriteExisting}
        />

        <Checkbox
          label="Rinomina automaticamente file duplicati"
          description="Aggiunge un numero progressivo ai file duplicati"
          checked={localSettings?.autoRename}
          onChange={(e) => handleSettingChange('autoRename', e?.target?.checked)}
        />

        <Checkbox
          label="Mantieni struttura cartelle"
          description="Preserva la struttura delle cartelle durante il caricamento"
          checked={localSettings?.preserveStructure}
          onChange={(e) => handleSettingChange('preserveStructure', e?.target?.checked)}
        />
      </div>
      {/* Image Processing */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Elaborazione Immagini</h4>
        
        <Checkbox
          label="Comprimi immagini"
          description="Riduce la dimensione delle immagini per risparmiare spazio"
          checked={localSettings?.compressImages}
          onChange={(e) => handleSettingChange('compressImages', e?.target?.checked)}
        />

        {localSettings?.compressImages && (
          <div className="ml-6">
            <Select
              label="Qualità Compressione"
              options={qualityOptions}
              value={localSettings?.imageQuality}
              onChange={(value) => handleSettingChange('imageQuality', value)}
            />
          </div>
        )}
      </div>
      {/* Allowed File Types */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Tipi di File Consentiti</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['pdf', 'txt', 'log', 'exe', 'mp3', 'mp4', 'jpg', 'jpeg', 'png', 'gif']?.map((type) => (
            <Checkbox
              key={type}
              label={type?.toUpperCase()}
              checked={localSettings?.allowedTypes?.includes(type)}
              onChange={(e) => {
                const newTypes = e?.target?.checked
                  ? [...localSettings?.allowedTypes, type]
                  : localSettings?.allowedTypes?.filter(t => t !== type);
                handleSettingChange('allowedTypes', newTypes);
              }}
            />
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={handleResetSettings}
        >
          Ripristina Default
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
          >
            Annulla
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Check"
            iconPosition="left"
            onClick={handleApplySettings}
          >
            Applica Impostazioni
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadSettings;
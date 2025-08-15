import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const PermissionsTab = ({ file, onUpdateFile }) => {
  const [permissions, setPermissions] = useState({
    owner: {
      read: true,
      write: true,
      execute: file?.type === 'exe'
    },
    group: {
      read: true,
      write: false,
      execute: false
    },
    others: {
      read: true,
      write: false,
      execute: false
    }
  });

  const [attributes, setAttributes] = useState({
    readOnly: file?.attributes?.includes('Sola lettura') || false,
    hidden: file?.attributes?.includes('Nascosto') || false,
    system: file?.attributes?.includes('Sistema') || false,
    archive: file?.attributes?.includes('Archivio') || true
  });

  const [sharing, setSharing] = useState({
    shared: false,
    shareLink: '',
    allowDownload: true,
    allowEdit: false,
    expiryDate: ''
  });

  const handlePermissionChange = (user, permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [user]: {
        ...prev?.[user],
        [permission]: value
      }
    }));
  };

  const handleAttributeChange = (attribute, value) => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: value
    }));
  };

  const handleSharingChange = (setting, value) => {
    setSharing(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const generateShareLink = () => {
    const randomId = Math.random()?.toString(36)?.substring(2, 15);
    const shareLink = `https://filemanager.local/share/${randomId}`;
    setSharing(prev => ({
      ...prev,
      shareLink,
      shared: true
    }));
  };

  const copyShareLink = () => {
    navigator.clipboard?.writeText(sharing?.shareLink);
  };

  const applyChanges = () => {
    const newAttributes = [];
    if (attributes?.readOnly) newAttributes?.push('Sola lettura');
    if (attributes?.hidden) newAttributes?.push('Nascosto');
    if (attributes?.system) newAttributes?.push('Sistema');
    if (attributes?.archive) newAttributes?.push('Archivio');

    onUpdateFile({
      ...file,
      attributes: newAttributes,
      permissions: permissions,
      sharing: sharing
    });
  };

  return (
    <div className="space-y-6">
      {/* File Permissions */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={16} className="mr-2 text-primary" />
          Permessi file
        </h4>
        
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-4 gap-0 text-xs font-medium text-muted-foreground bg-muted/50">
            <div className="p-3 border-r border-border">Utente</div>
            <div className="p-3 border-r border-border text-center">Lettura</div>
            <div className="p-3 border-r border-border text-center">Scrittura</div>
            <div className="p-3 text-center">Esecuzione</div>
          </div>
          
          {Object.entries(permissions)?.map(([user, perms]) => (
            <div key={user} className="grid grid-cols-4 gap-0 border-t border-border">
              <div className="p-3 border-r border-border">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={user === 'owner' ? 'User' : user === 'group' ? 'Users' : 'Globe'} 
                    size={14} 
                    className="text-muted-foreground" 
                  />
                  <span className="text-sm text-foreground capitalize">
                    {user === 'owner' ? 'Proprietario' : user === 'group' ? 'Gruppo' : 'Altri'}
                  </span>
                </div>
              </div>
              <div className="p-3 border-r border-border flex justify-center">
                <Checkbox
                  checked={perms?.read}
                  onChange={(e) => handlePermissionChange(user, 'read', e?.target?.checked)}
                />
              </div>
              <div className="p-3 border-r border-border flex justify-center">
                <Checkbox
                  checked={perms?.write}
                  onChange={(e) => handlePermissionChange(user, 'write', e?.target?.checked)}
                />
              </div>
              <div className="p-3 flex justify-center">
                <Checkbox
                  checked={perms?.execute}
                  onChange={(e) => handlePermissionChange(user, 'execute', e?.target?.checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* File Attributes */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={16} className="mr-2 text-primary" />
          Attributi file
        </h4>
        
        <div className="space-y-3">
          <Checkbox
            label="Sola lettura"
            description="Il file non può essere modificato o eliminato"
            checked={attributes?.readOnly}
            onChange={(e) => handleAttributeChange('readOnly', e?.target?.checked)}
          />
          
          <Checkbox
            label="Nascosto"
            description="Il file è nascosto nella visualizzazione normale"
            checked={attributes?.hidden}
            onChange={(e) => handleAttributeChange('hidden', e?.target?.checked)}
          />
          
          <Checkbox
            label="File di sistema"
            description="Il file è contrassegnato come file di sistema"
            checked={attributes?.system}
            onChange={(e) => handleAttributeChange('system', e?.target?.checked)}
          />
          
          <Checkbox
            label="Archivio"
            description="Il file è pronto per l'archiviazione"
            checked={attributes?.archive}
            onChange={(e) => handleAttributeChange('archive', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Sharing Settings */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-4 flex items-center">
          <Icon name="Share2" size={16} className="mr-2 text-primary" />
          Condivisione
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Condividi file</p>
              <p className="text-xs text-muted-foreground">Genera un link di condivisione per questo file</p>
            </div>
            <Button
              variant={sharing?.shared ? "outline" : "default"}
              size="sm"
              onClick={generateShareLink}
              disabled={sharing?.shared}
            >
              {sharing?.shared ? (
                <>
                  <Icon name="Check" size={14} className="mr-1" />
                  Condiviso
                </>
              ) : (
                <>
                  <Icon name="Share2" size={14} className="mr-1" />
                  Condividi
                </>
              )}
            </Button>
          </div>

          {sharing?.shared && (
            <div className="bg-surface rounded-lg p-4 border border-border space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Link di condivisione</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="text"
                    value={sharing?.shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md"
                  />
                  <Button variant="outline" size="sm" onClick={copyShareLink}>
                    <Icon name="Copy" size={14} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Checkbox
                  label="Consenti download"
                  checked={sharing?.allowDownload}
                  onChange={(e) => handleSharingChange('allowDownload', e?.target?.checked)}
                />
                
                <Checkbox
                  label="Consenti modifica"
                  checked={sharing?.allowEdit}
                  onChange={(e) => handleSharingChange('allowEdit', e?.target?.checked)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Data di scadenza (opzionale)</label>
                <input
                  type="date"
                  value={sharing?.expiryDate}
                  onChange={(e) => handleSharingChange('expiryDate', e?.target?.value)}
                  className="mt-1 w-full px-3 py-2 text-sm bg-background border border-border rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Security Information */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="ShieldCheck" size={16} className="text-success" />
          <h4 className="text-sm font-medium text-foreground">Informazioni sicurezza</h4>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• File scansionato: ✓ Nessuna minaccia rilevata</p>
          <p>• Ultima scansione: 15/08/2024 11:30:15</p>
          <p>• Firma digitale: Non presente</p>
          <p>• Origine: Locale</p>
        </div>
      </div>
      {/* Apply Changes Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={applyChanges}>
          <Icon name="Save" size={14} className="mr-2" />
          Applica modifiche
        </Button>
      </div>
    </div>
  );
};

export default PermissionsTab;
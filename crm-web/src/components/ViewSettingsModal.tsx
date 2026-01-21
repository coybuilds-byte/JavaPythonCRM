import { useState, useEffect } from 'react';

export interface ViewPreferences {
    clients: {
        showIndustry: boolean;
        showContact: boolean;
        showPhone: boolean;
        showJobs: boolean;
    };
    candidates: {
        showTitle: boolean;
        showSkills: boolean;
        showStatus: boolean;
    };
}

export const DEFAULT_PREFS: ViewPreferences = {
    clients: {
        showIndustry: true,
        showContact: true,
        showPhone: true,
        showJobs: true
    },
    candidates: {
        showTitle: true,
        showSkills: true,
        showStatus: true
    }
};

interface ViewSettingsModalProps {
    onClose: () => void;
    onSave: () => void; // Trigger parent refresh
}

export default function ViewSettingsModal({ onClose, onSave }: ViewSettingsModalProps) {
    const [prefs, setPrefs] = useState<ViewPreferences>(DEFAULT_PREFS);

    useEffect(() => {
        const stored = localStorage.getItem('psm_view_prefs');
        if (stored) {
            try {
                setPrefs(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse prefs", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('psm_view_prefs', JSON.stringify(prefs));
        onSave();
        onClose();
    };

    const toggle = (category: 'clients' | 'candidates', field: string) => {
        setPrefs(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: !(prev[category] as any)[field]
            }
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{width: '500px'}}>
                <h3>View Settings</h3>
                
                <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
                    <div style={{flex:1}}>
                        <h4 style={{marginBottom:'10px', color:'var(--primary-light)'}}>Client Columns</h4>
                        <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={prefs.clients.showIndustry} 
                                    onChange={() => toggle('clients', 'showIndustry')}
                                /> Industry
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={prefs.clients.showContact} 
                                    onChange={() => toggle('clients', 'showContact')}
                                /> Contact Person
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={prefs.clients.showPhone} 
                                    onChange={() => toggle('clients', 'showPhone')}
                                /> Phone
                            </label>
                             <label>
                                <input 
                                    type="checkbox" 
                                    checked={prefs.clients.showJobs} 
                                    onChange={() => toggle('clients', 'showJobs')}
                                /> Open Jobs
                            </label>
                        </div>
                    </div>

                    <div style={{flex:1}}>
                         <h4 style={{marginBottom:'10px', color:'var(--primary-light)'}}>Candidate Columns</h4>
                         <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={prefs.candidates.showTitle} 
                                    onChange={() => toggle('candidates', 'showTitle')}
                                /> Job Title
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={prefs.candidates.showSkills} 
                                    onChange={() => toggle('candidates', 'showSkills')}
                                /> Top Skills
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={prefs.candidates.showStatus} 
                                    onChange={() => toggle('candidates', 'showStatus')}
                                /> Status
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal-actions" style={{marginTop:'30px'}}>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}

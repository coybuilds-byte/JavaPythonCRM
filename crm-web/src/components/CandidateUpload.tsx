import { useState } from 'react'
import './CandidateUpload.css' // We will create this or use styled components roughly

interface ParsedResult {
    name: string
    email?: string
    phone?: string
    skills: string[]
    text_content?: string
}

export default function CandidateUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<string>('')
    const [result, setResult] = useState<ParsedResult | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
            setStatus('')
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
            setResult(null)
            setStatus('')
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setStatus('Parsing...')
        const formData = new FormData()
        formData.append('file', file)

        try {
            // Point to Java Backend which proxies to AI service
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
            const response = await fetch(`${apiUrl}/api/candidates/parse`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Parsing failed')

            const data = await response.json()
            setResult(data)
            setStatus('Success')
        } catch (err) {
            console.error(err)
            setStatus('Error occurred')
        }
    }

    return (
        <div className="upload-section">
            <div 
                className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="icon">📄</div>
                <h3>{file ? file.name : "Drag & Drop Resume"}</h3>
                <p>or</p>
                <label className="file-input-label">
                    Browse Files
                    <input type="file" hidden accept=".pdf,.docx" onChange={handleFileChange} />
                </label>
            </div>

            <div className="actions">
                <button 
                    className="btn-primary" 
                    onClick={handleUpload} 
                    disabled={!file || status === 'Parsing...'}
                >
                    {status === 'Parsing...' ? 'Analyzing...' : 'Parse Resume'}
                </button>
            </div>

            {result && (
                <div className="result-card card">
                    <div className="result-header">
                        <div className="avatar">{result.name?.charAt(0) || '?'}</div>
                        <div>
                            <h3>{result.name}</h3>
                            <p className="contact-info">{result.email} • {result.phone}</p>
                        </div>
                    </div>
                    
                    <div className="skills-section">
                        <h4>Skills Detected</h4>
                        <div className="skills-grid">
                            {result.skills.map(skill => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

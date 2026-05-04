import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { useQuizStore } from '../store/useQuizStore'
import { validateQuizFile } from '../utils/validation'

const Upload = () => {
  const navigate = useNavigate()
  const loadQuiz = useQuizStore((state) => state.loadQuiz)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [fileName, setFileName] = useState('')

  const handleFile = async (file: File) => {
    setErrors([])
    setFileName(file.name)

    const text = await file.text()

    try {
      const json = JSON.parse(text)
      const result = validateQuizFile(json)
      if (!result.valid || !result.quiz) {
        setErrors(result.errors)
        return
      }

      loadQuiz(result.quiz, file.name)
      navigate('/')
    } catch {
      setErrors(['Invalid JSON file. Please check the file format.'])
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleLoadSample = async () => {
    const response = await fetch('/sample-questions.json')
    const data = await response.json()
    const result = validateQuizFile(data)
    if (result.valid && result.quiz) {
      loadQuiz(result.quiz, 'Sample dataset')
      navigate('/')
    }
  }

  return (
    <PageTransition>
      <section className="grid gap-6">
        <div className="glass rounded-[32px] p-8">
          <h1 className="font-display text-3xl font-semibold text-ink">Upload a JSON question pack</h1>
          <p className="mt-2 text-sm text-muted">
            Drag and drop your JSON file below or browse from your device. We validate the
            structure before starting.
          </p>

          <div
            role="presentation"
            onDragOver={(event) => {
              event.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mt-6 flex min-h-[180px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition ${
              dragActive ? 'border-brand bg-brandSoft' : 'border-black/15 bg-panel'
            }`}
          >
            <p className="text-sm font-semibold text-ink">
              {fileName ? `Loaded: ${fileName}` : 'Drop your JSON file here'}
            </p>
            <p className="text-xs text-muted">Expected schema: level, title, questions, choices.</p>
            <label className="mt-4 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-card">
              Browse file
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
            </label>
          </div>

          {errors.length > 0 && (
            <div className="mt-4 rounded-2xl border border-danger bg-dangerSoft p-4 text-xs text-danger">
              <p className="font-semibold">Validation issues</p>
              <ul className="mt-2 list-disc pl-5">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={handleLoadSample}
            className="mt-6 rounded-full border border-black/10 bg-panel px-4 py-2 text-xs font-semibold text-ink shadow-card"
          >
            Load sample JSON
          </button>
        </div>
      </section>
    </PageTransition>
  )
}

export default Upload

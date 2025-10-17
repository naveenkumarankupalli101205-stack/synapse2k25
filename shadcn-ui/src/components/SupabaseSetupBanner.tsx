import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ExternalLink, Settings } from 'lucide-react'

export const SupabaseSetupBanner = () => {
  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <Settings className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Demo Mode:</strong> Supabase is not configured. Authentication features are disabled.
        </div>
        <Button asChild size="sm" variant="outline">
          <a 
            href="https://supabase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1"
          >
            <span>Setup Supabase</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
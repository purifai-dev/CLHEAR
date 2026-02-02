"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, HelpCircle } from "lucide-react"
import { LICENSE_REGISTRY_SOURCES, LICENSE_SEARCH_INSTRUCTIONS } from "@/lib/license-registry-sources"

interface LicenseSearchHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entityName?: string
  jurisdiction?: string
}

export function LicenseSearchHelpDialog({
  open,
  onOpenChange,
  entityName,
  jurisdiction,
}: LicenseSearchHelpDialogProps) {
  const relevantSources = jurisdiction
    ? LICENSE_REGISTRY_SOURCES.filter((source) => source.jurisdiction === jurisdiction)
    : LICENSE_REGISTRY_SOURCES

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            How to Find License Information
            {entityName && ` for ${entityName}`}
          </DialogTitle>
          <DialogDescription>Follow these steps to locate and verify regulatory licenses</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">General Instructions:</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-4 rounded-md">
              {LICENSE_SEARCH_INSTRUCTIONS}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">
              {jurisdiction ? `Relevant Regulatory Sources for ${jurisdiction}:` : "All Regulatory Sources:"}
            </h3>
            <div className="space-y-2">
              {relevantSources.map((source, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{source.regulator}</p>
                      <p className="text-xs text-muted-foreground">{source.jurisdiction}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(source.searchUrl, "_blank")}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{source.description}</p>
                  <p className="text-xs font-mono text-muted-foreground break-all">{source.searchUrl}</p>
                </div>
              ))}
            </div>
          </div>

          {entityName && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Quick Search Links:</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/search?q="${entityName}"+regulatory+license+registration`,
                      "_blank",
                    )
                  }
                  className="flex items-center gap-2 justify-start"
                >
                  <ExternalLink className="w-3 h-3" />
                  Google Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodeURIComponent(entityName)}&action=getcompany`,
                      "_blank",
                    )
                  }
                  className="flex items-center gap-2 justify-start"
                >
                  <ExternalLink className="w-3 h-3" />
                  SEC EDGAR
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

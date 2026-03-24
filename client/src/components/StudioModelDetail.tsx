import * as Dialog from '@radix-ui/react-dialog';
import { X, FileText, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioModel } from '../data/studioModels';

/**
 * Cloudinary raw uploads set Content-Disposition: attachment which forces
 * download. Inserting fl_attachment:false in the URL path overrides this.
 * For non-Cloudinary URLs (local files, other hosts) we return as-is.
 */
function toInlineUrl(url: string): string {
  const match = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/raw\/upload\/)(v\d+\/.+)$/
  );
  if (match) {
    return `${match[1]}fl_attachment:false/${match[2]}`;
  }
  return url;
}

function toGoogleViewerUrl(url: string): string {
  if (url.startsWith('/')) return url;
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
}

interface StudioModelDetailProps {
  model: StudioModel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudioModelDetail = ({ model, isOpen, onClose }: StudioModelDetailProps) => {
  if (!model) return null;

  const hasPdf = !!model.pdfUrl;
  const rawUrl = model.pdfUrl || '';
  const isLocal = rawUrl.startsWith('/');
  const inlineUrl = toInlineUrl(rawUrl);
  const viewerUrl = isLocal ? rawUrl : toGoogleViewerUrl(inlineUrl);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]" />
        <AnimatePresence>
          {isOpen && (
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-3 sm:inset-6 bg-white z-[121] shadow-2xl focus:outline-none overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={20} className="text-amber-500 shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold tracking-tight truncate">
                        {model.name}
                      </h2>
                      <p className="text-xs text-neutral-400 uppercase tracking-wider">
                        {model.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {hasPdf && (
                      <>
                        <a
                          href={inlineUrl}
                          download
                          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg transition-colors"
                        >
                          <Download size={14} />
                          Download
                        </a>
                        <a
                          href={inlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded-lg transition-colors"
                        >
                          <ExternalLink size={14} />
                          Open in Tab
                        </a>
                      </>
                    )}
                    <Dialog.Close className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                      <X size={20} />
                    </Dialog.Close>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0">
                  {hasPdf ? (
                    <iframe
                      src={viewerUrl}
                      title={`${model.name} — PDF`}
                      className="w-full h-full border-0"
                      allow="autoplay"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <div className="w-full max-w-md mx-auto mb-8">
                        <img
                          src={model.image}
                          alt={model.name}
                          className="w-full rounded-lg shadow-lg"
                        />
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed max-w-lg mb-4">
                        {model.description}
                      </p>
                      <span className="inline-block px-4 py-2 bg-neutral-100 text-neutral-500 text-xs font-medium rounded-lg">
                        PDF not available yet
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile action bar */}
                {hasPdf && (
                  <div className="sm:hidden flex gap-2 p-3 border-t border-neutral-100 shrink-0">
                    <a
                      href={inlineUrl}
                      download
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium border border-neutral-200 rounded-lg"
                    >
                      <Download size={14} />
                      Download
                    </a>
                    <a
                      href={inlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium bg-amber-500 text-white rounded-lg"
                    >
                      <ExternalLink size={14} />
                      Open in Tab
                    </a>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

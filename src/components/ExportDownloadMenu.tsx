import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useAppSelector } from '../hooks/reduxHooks';
import { ensureDataParsed } from '../utils/dataUtils';
import { downloadMeritCsv, downloadMeritExcel, downloadMeritJson } from '../utils/meritExport';

export default function ExportDownloadMenu() {
  const { data, lastRequestedRange, isLoading } = useAppSelector((s) => s.meritData);
  const [open, setOpen] = useState(false);
  const [excelBusy, setExcelBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const parsed = data ? ensureDataParsed(data) : null;
  const hasTs = !!parsed?.timeseries_values?.timestamps?.length;
  const disabled = isLoading || !hasTs;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const onCsv = () => {
    if (parsed && hasTs) {
      downloadMeritCsv(parsed, lastRequestedRange);
      close();
    }
  };

  const onJson = () => {
    if (parsed && hasTs) {
      downloadMeritJson(parsed, lastRequestedRange);
      close();
    }
  };

  const onExcel = async () => {
    if (!parsed || !hasTs) return;
    setExcelBusy(true);
    try {
      await downloadMeritExcel(parsed, lastRequestedRange);
      close();
    } catch (err) {
      console.error('Excel export failed:', err);
    } finally {
      setExcelBusy(false);
    }
  };

  return (
    <div className="export-menu" ref={wrapRef}>
      <button
        type="button"
        className="export-menu-trigger"
        aria-label="Download data"
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={disabled}
        title={disabled ? 'Load data to download' : 'Download data'}
        onClick={() => setOpen((v) => !v)}
      >
        <Download className="export-menu-trigger-icon" size={20} strokeWidth={2} aria-hidden />
      </button>
      {open && !disabled && (
        <ul className="export-menu-dropdown" role="menu" aria-label="Export format">
          <li role="none">
            <button type="button" className="export-menu-item" role="menuitem" onClick={onCsv}>
              CSV
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              className="export-menu-item"
              role="menuitem"
              onClick={onExcel}
              disabled={excelBusy}
              aria-busy={excelBusy}
            >
              {excelBusy ? (
                <Loader2 className="export-menu-item-spin" size={16} strokeWidth={2} aria-hidden />
              ) : null}
              Excel
            </button>
          </li>
          <li role="none">
            <button type="button" className="export-menu-item" role="menuitem" onClick={onJson}>
              JSON
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

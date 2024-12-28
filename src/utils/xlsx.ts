import { utils, writeFileXLSX } from 'xlsx';

import { dateNameFormat } from './helper';

export const exportExcel = (data: any[], sheet: string = 'NuovoData') => {
  /* generate worksheet from state */
  const worksheet = utils.aoa_to_sheet([['']]);
  const wscols = [
    { wch: 6 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];
  const ws = utils.sheet_add_json(worksheet, data, { origin: 'A2' });
  ws['!cols'] = wscols;
  ws['!merges'] = [];
  ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } });
  // add header to a1
  ws.A1 = {
    t: 's',
    // v: "System Events",
    s: {
      font: {
        name: 'Comic Sans MS',
        family: 4,
        size: 12,
        underline: 'single',
        bold: true,
      },
      alignment: { vertical: 'middle', horizontal: 'center' },
    },
  };

  /* create workbook and append worksheet */
  const wb = utils.book_new();
  // add one row of headers
  utils.book_append_sheet(wb, ws, sheet);
  /* export to XLSX */
  writeFileXLSX(wb, `${sheet}_${dateNameFormat()}.xlsx`);
};

export const exportJson = (data: any[], sheet: string = 'NuovoData') => {
  // export data as json
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `events.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

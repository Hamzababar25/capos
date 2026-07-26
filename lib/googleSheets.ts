import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME ?? 'Subscribers';
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(SPREADSHEET_ID && CLIENT_EMAIL && PRIVATE_KEY);
}

let client: JWT | null = null;

function getClient(): JWT {
  if (!client) {
    client = new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }
  return client;
}

/**
 * Appends a row to the configured Google Sheet. Each call adds one row
 * below the last used one, so the sheet grows as a running signup log.
 */
export async function appendNewsletterSubscriber(email: string): Promise<void> {
  if (!isGoogleSheetsConfigured()) {
    throw new Error('Google Sheets is not configured (missing env vars)');
  }

  const { token } = await getClient().getAccessToken();

  const range = `${encodeURIComponent(SHEET_NAME)}!A:B`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [[email, new Date().toISOString()]],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets append failed (${res.status}): ${body}`);
  }
}

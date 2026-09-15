function formatAmount(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PrintReceipt({ payment, message }) {
  if (!payment) return null;

  const printedAt = formatDate(new Date());

  return (
    <div className="print-receipt">
      <div className="print-receipt__header">
        <span className="print-receipt__brand">DGI — Télépaiement STT</span>
        <h1>Traitement de paiement STT</h1>
      </div>

      {message && <p className="print-receipt__message">{message}</p>}

      <table className="print-receipt__table">
        <tbody>
          <tr>
            <th>Référence transaction</th>
            <td>{payment.transactionId}</td>
          </tr>
          {payment.transactionIdBank && (
            <tr>
              <th>Référence banque</th>
              <td>{payment.transactionIdBank}</td>
            </tr>
          )}
          <tr>
            <th>Type d'opération</th>
            <td>{payment.operationType}</td>
          </tr>
          <tr>
            <th>Statut</th>
            <td>{payment.status}</td>
          </tr>
          <tr>
            <th>Montant</th>
            <td>{formatAmount(payment.amount)} MRU</td>
          </tr>
          <tr>
            <th>Raison sociale</th>
            <td>{payment.taxPayerLegalName}</td>
          </tr>
          <tr>
            <th>IBAN</th>
            <td>{payment.taxPayerIban}</td>
          </tr>
          <tr>
            <th>Téléphone</th>
            <td>{payment.taxPayerPhoneNumber}</td>
          </tr>
          <tr>
            <th>Date de l'opération</th>
            <td>{formatDate(payment.operationDate)}</td>
          </tr>
          {payment.archivedAt && (
            <tr>
              <th>Traité le</th>
              <td>{formatDate(payment.archivedAt)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="print-receipt__footer">Document imprimé le {printedAt}</p>
    </div>
  );
}

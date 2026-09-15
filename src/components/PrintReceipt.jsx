export default function PrintReceipt({ payment, message }) {
  if (!payment) return null;

  const printedAt = new Date().toLocaleString('fr-FR');

  return (
    <div className="print-receipt">
      <div className="print-receipt__header">
        <span className="print-receipt__brand">DGI — Télépaiement STT</span>
        <h1>Reçu de paiement</h1>
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
            <td>{payment.amount} MRU</td>
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
            <th>NIF</th>
            <td>{payment.nif}</td>
          </tr>
          <tr>
            <th>NTD</th>
            <td>{payment.ntd}</td>
          </tr>
          <tr>
            <th>Téléphone</th>
            <td>{payment.taxPayerPhoneNumber}</td>
          </tr>
          <tr>
            <th>Date de l'opération</th>
            <td>{payment.operationDate}</td>
          </tr>
          {payment.archivedAt && (
            <tr>
              <th>Archivé le</th>
              <td>{payment.archivedAt}</td>
            </tr>
          )}
        </tbody>
      </table>

      <p className="print-receipt__footer">Document imprimé le {printedAt}</p>
    </div>
  );
}

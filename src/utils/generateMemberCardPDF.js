import jsPDF from 'jspdf';
import QRCode from 'qrcode';

/**
 * Gera PDF da carteirinha de membro
 * 
 * @param {Object} memberData - Dados do membro
 * @param {string} memberData.name - Nome completo
 * @param {string} memberData.memberId - ID do membro
 * @param {string} memberData.memberNumber - Número do membro
 * @param {string} memberData.status - Status (ativo, pendente, inativo)
 * @param {string} memberData.joinedAt - Data de entrada
 * @param {string} memberData.expiresAt - Data de expiração
 * @param {string} memberData.photoUrl - URL da foto
 * @param {string} memberData.churchName - Nome da igreja
 * @param {string} memberData.churchLogoUrl - URL do logo
 * @param {string} memberData.qrCodeUrl - URL para o QR Code
 * @returns {Promise<Blob>} - PDF como Blob
 */
export async function generateMemberCardPDF(memberData) {
  const {
    name,
    memberId,
    memberNumber,
    status,
    joinedAt,
    expiresAt,
    photoUrl,
    churchName,
    churchLogoUrl,
    qrCodeUrl
  } = memberData;

  // Criar documento PDF (tamanho cartão de crédito: 85.6mm x 53.98mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98]
  });

  // Cores
  const primaryColor = [66, 165, 245]; // #42a5f5
  const darkBg = [26, 31, 46]; // #1a1f2e
  const textWhite = [255, 255, 255];
  const textGray = [200, 200, 200];

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // ============ FRENTE DA CARTEIRINHA ============
  
  // Background gradiente (simulado com retângulos)
  pdf.setFillColor(...darkBg);
  pdf.rect(0, 0, 85.6, 53.98, 'F');

  // Header com borda
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.5);
  pdf.line(5, 12, 80.6, 12);

  // Logo da igreja (se disponível)
  if (churchLogoUrl) {
    try {
      const logoImg = await loadImage(churchLogoUrl);
      pdf.addImage(logoImg, 'PNG', 5, 3, 8, 8);
    } catch (error) {
      console.warn('Não foi possível carregar logo:', error);
      // Fallback: primeira letra do nome da igreja
      pdf.setFontSize(12);
      pdf.setTextColor(...primaryColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(churchName.charAt(0), 9, 9, { align: 'center' });
    }
  } else {
    // Primeira letra do nome da igreja
    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text(churchName.charAt(0), 9, 9, { align: 'center' });
  }

  // Nome da igreja
  pdf.setFontSize(9);
  pdf.setTextColor(...textWhite);
  pdf.setFont('helvetica', 'bold');
  pdf.text(churchName, 15, 6);

  // Subtítulo
  pdf.setFontSize(7);
  pdf.setTextColor(...textGray);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Carteira de Membro', 15, 10);

  // Foto do membro
  if (photoUrl) {
    try {
      const photoImg = await loadImage(photoUrl);
      // Foto circular (simulada com clip)
      pdf.addImage(photoImg, 'JPEG', 8, 15, 15, 15);
    } catch (error) {
      console.warn('Não foi possível carregar foto:', error);
      // Fallback: iniciais
      pdf.setFillColor(66, 165, 245, 50);
      pdf.circle(15.5, 22.5, 7.5, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(...primaryColor);
      pdf.setFont('helvetica', 'bold');
      const initials = name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2);
      pdf.text(initials, 15.5, 24, { align: 'center' });
    }
  } else {
    // Iniciais
    pdf.setFillColor(66, 165, 245, 50);
    pdf.circle(15.5, 22.5, 7.5, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    const initials = name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2);
    pdf.text(initials, 15.5, 24, { align: 'center' });
  }

  // Nome do membro
  pdf.setFontSize(10);
  pdf.setTextColor(...textWhite);
  pdf.setFont('helvetica', 'bold');
  const nameLines = pdf.splitTextToSize(name.toUpperCase(), 50);
  pdf.text(nameLines, 26, 17);

  // Informações
  let yPos = 25;
  const infoData = [
    { label: 'Nº Membro:', value: memberNumber || memberId },
    { label: 'Status:', value: status.charAt(0).toUpperCase() + status.slice(1) },
    { label: 'Membro desde:', value: formatDate(joinedAt) },
  ];

  if (expiresAt) {
    infoData.push({ label: 'Validade:', value: formatDate(expiresAt) });
  }

  infoData.forEach((info) => {
    // Label
    pdf.setFontSize(6);
    pdf.setTextColor(...textGray);
    pdf.setFont('helvetica', 'normal');
    pdf.text(info.label, 26, yPos);

    // Value
    pdf.setFontSize(7);
    pdf.setTextColor(...textWhite);
    pdf.setFont('helvetica', 'bold');
    pdf.text(info.value, 45, yPos);

    yPos += 4;
  });

  // QR Code
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    pdf.addImage(qrCodeDataUrl, 'PNG', 62, 15, 18, 18);
    
    // Label do QR Code
    pdf.setFontSize(5);
    pdf.setTextColor(...textGray);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Validar', 71, 34, { align: 'center' });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
  }

  // Footer
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.3);
  pdf.line(5, 41, 80.6, 41);

  pdf.setFontSize(5);
  pdf.setTextColor(...textGray);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Carteirinha pessoal e intransferível', 42.8, 44, { align: 'center' });

  // ID no rodapé
  pdf.setFontSize(4);
  pdf.text(`ID: ${memberId}`, 5, 50);
  pdf.text(`Emitida: ${formatDate(new Date().toISOString())}`, 80.6, 50, { align: 'right' });

  // ============ VERSO DA CARTEIRINHA ============
  
  pdf.addPage();

  // Background
  pdf.setFillColor(45, 55, 72); // Cor diferente para o verso
  pdf.rect(0, 0, 85.6, 53.98, 'F');

  // Título
  pdf.setFontSize(9);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Informações Importantes', 42.8, 8, { align: 'center' });

  // Linha decorativa
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.5);
  pdf.line(10, 10, 75.6, 10);

  // Lista de informações
  const instructions = [
    'Esta carteirinha é pessoal e intransferível',
    'Apresente-a sempre que solicitado',
    'Em caso de perda, comunique imediatamente',
    'Valide através do QR Code na frente'
  ];

  let instructionY = 15;
  pdf.setFontSize(6);
  pdf.setTextColor(...textWhite);
  pdf.setFont('helvetica', 'normal');

  instructions.forEach((instruction) => {
    pdf.text('•', 12, instructionY);
    const lines = pdf.splitTextToSize(instruction, 60);
    pdf.text(lines, 15, instructionY);
    instructionY += lines.length * 3 + 1;
  });

  // Box de validação
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.3);
  pdf.rect(10, instructionY + 2, 65.6, 12, 'S');

  pdf.setFontSize(7);
  pdf.setTextColor(...textWhite);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Validação Online:', 12, instructionY + 6);

  pdf.setFontSize(5);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'normal');
  const urlLines = pdf.splitTextToSize(qrCodeUrl, 60);
  pdf.text(urlLines, 12, instructionY + 9);

  // Footer do verso
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.3);
  pdf.line(10, 46, 75.6, 46);

  pdf.setFontSize(5);
  pdf.setTextColor(...textGray);
  pdf.setFont('helvetica', 'italic');
  pdf.text(churchName, 42.8, 49, { align: 'center' });
  pdf.text(`ID: ${memberId}`, 42.8, 52, { align: 'center' });

  // Retornar PDF como Blob
  return pdf.output('blob');
}

/**
 * Função auxiliar para carregar imagem
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

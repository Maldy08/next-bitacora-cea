export interface EmailData {
  email_to: string;
  email_subject: string;
  email_body: string;
  email_from: string;
  email_from_name?: string;
  email_cc?: string[];
  email_attachment?: any;
}

const ESTADO_COLOR: Record<string, string> = {
  Pendiente: "#475569",
  Activo: "#d97706",
  Pausado: "#ea580c",
  Completado: "#059669",
};

function formatFecha(fecha: Date | string | null | undefined): string {
  if (!fecha) return "Sin fecha definida";
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  if (isNaN(d.getTime())) return "Sin fecha definida";
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
}

export function generateEmailBodyTemaAsignado(
  appUrl: string,
  empleadoNombre: string,
  tituloTema: string,
  descripcionTema: string,
  estado: string,
  departamentoOrigen: string,
  fechaLimite: Date | string | null,
  tipoInvolucrado: string,
  asignadoPor: string
): string {
  const colorEstado = ESTADO_COLOR[estado] ?? "#475569";
  const fechaTexto = formatFecha(fechaLimite);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tema asignado</title>
  <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  <![endif]-->
  <style type="text/css">
    .outlook-only { display: none; max-height: 0; overflow: hidden; }
    table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  </style>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:#f8fafc;color:#1f2937;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8fafc">
    <tr>
      <td align="center" valign="top">
        <table width="800" border="0" cellspacing="0" cellpadding="0" style="max-width:800px;">
          <tr>
            <td style="padding:30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="50" bgcolor="#ffffff" style="border-collapse:separate;border-spacing:0;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
                <tr>
                  <td style="font-family:sans-serif;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
                          <p style="margin:0;font-size:26px;font-weight:600;color:#0f172a;">📌 Tema asignado</p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-top:25px;font-size:18px;line-height:1.6;color:#1f2937;">
                          <p style="margin:0 0 20px 0;">Estimado(a) <strong style="color:#1f2937;">${empleadoNombre}</strong>,</p>
                          <p style="margin:0 0 20px 0;">Le informamos que se le ha asignado un nuevo tema en el <strong>Sistema de Seguimiento de Temas</strong> con el rol de <strong style="color:#1f2937;">${tipoInvolucrado}</strong>.</p>
                          <p style="margin:0 0 25px 0;">A continuación, se muestran los datos principales del tema:</p>

                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;font-family:sans-serif;">
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;width:30%;">Título</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${tituloTema}</td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Descripción</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${descripcionTema}</td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Estado</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">
                                <span style="display:inline-block;padding:4px 10px;border-radius:9999px;background-color:${colorEstado};color:#ffffff;font-weight:bold;font-size:12px;">${estado}</span>
                              </td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Departamento de origen</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${departamentoOrigen}</td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Fecha límite</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${fechaTexto}</td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Asignado por</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${asignadoPor}</td>
                            </tr>
                          </table>

                          <div style="margin:30px 0;text-align:center;">
                            <!--[if mso]>
                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                                href="${appUrl}"
                                style="height:48px;v-text-anchor:middle;width:240px;" arcsize="10%" strokecolor="#651930" fillcolor="#651930">
                                <w:anchorlock/>
                                <center style="color:#ffffff;font-family:sans-serif;font-size:18px;font-weight:500;">Consultar Tema</center>
                              </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                              <a href="${appUrl}"
                                style="background-color:#651930;color:#ffffff;padding:14px 35px;font-size:18px;border-radius:8px;font-weight:500;text-decoration:none;display:inline-block;min-width:200px;">
                                Consultar Tema
                              </a>
                            <!--<![endif]-->
                          </div>

                          <p style="margin:30px 0 0 0;color:#6b7280;font-size:16px;line-height:1.6;">
                            Si considera que ha sido asignado por error, por favor comuníquese con el responsable del tema para aclarar la situación.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:45px;border-top:1px solid #e5e7eb;padding-top:25px;">
                      <tr>
                        <td style="font-size:15px;color:#6b7280;text-align:center;line-height:1.6;">
                          Sistema de Seguimiento de Temas · COMISIÓN ESTATAL DEL AGUA DE BAJA CALIFORNIA<br />
                          Este mensaje ha sido enviado automáticamente. Por favor, no responda a este correo.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <div class="outlook-only">&#8203;</div>
</body>
</html>`;
}

export function generateEmailBodyNuevoAvance(
  appUrl: string,
  empleadoNombre: string,
  tituloTema: string,
  estado: string,
  capturadoPor: string,
  observaciones: string,
  fechaHora: Date | string,
  totalAdjuntos: number
): string {
  const colorEstado = ESTADO_COLOR[estado] ?? "#475569";
  const d = typeof fechaHora === "string" ? new Date(fechaHora) : fechaHora;
  const fechaTexto = isNaN(d.getTime())
    ? ""
    : `${d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })} · ${d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`;
  const observacionesHtml = (observaciones ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  const adjuntosTexto = totalAdjuntos > 0
    ? `${totalAdjuntos} archivo${totalAdjuntos !== 1 ? "s" : ""} adjunto${totalAdjuntos !== 1 ? "s" : ""}`
    : "Sin archivos adjuntos";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo avance registrado</title>
  <style type="text/css">
    .outlook-only { display: none; max-height: 0; overflow: hidden; }
    table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  </style>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:#f8fafc;color:#1f2937;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8fafc">
    <tr>
      <td align="center" valign="top">
        <table width="800" border="0" cellspacing="0" cellpadding="0" style="max-width:800px;">
          <tr>
            <td style="padding:30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="50" bgcolor="#ffffff" style="border-collapse:separate;border-spacing:0;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
                <tr>
                  <td style="font-family:sans-serif;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
                          <p style="margin:0;font-size:26px;font-weight:600;color:#0f172a;">📝 Nuevo avance registrado</p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-top:25px;font-size:18px;line-height:1.6;color:#1f2937;">
                          <p style="margin:0 0 20px 0;">Estimado(a) <strong style="color:#1f2937;">${empleadoNombre}</strong>,</p>
                          <p style="margin:0 0 25px 0;">Se ha registrado un <strong>nuevo avance</strong> en un tema en el que estás involucrado(a) dentro del <strong>Sistema de Seguimiento de Temas</strong>.</p>

                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;font-family:sans-serif;">
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;width:30%;">Tema</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${tituloTema}</td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Estado actual</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">
                                <span style="display:inline-block;padding:4px 10px;border-radius:9999px;background-color:${colorEstado};color:#ffffff;font-weight:bold;font-size:12px;">${estado}</span>
                              </td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Capturado por</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${capturadoPor}</td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Fecha y hora</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${fechaTexto}</td>
                            </tr>
                            <tr>
                              <th align="left" valign="top" style="padding:12px 16px;background-color:#f1f5f9;color:#1f2937;font-weight:bold;font-size:16px;border-bottom:1px solid #e5e7eb;">Evidencias</th>
                              <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;">${adjuntosTexto}</td>
                            </tr>
                          </table>

                          <div style="margin:25px 0 0 0;padding:18px 20px;background-color:#f8fafc;border-left:4px solid ${colorEstado};border-radius:6px;">
                            <p style="margin:0 0 8px 0;font-weight:bold;font-size:14px;color:#0f172a;">Avance / Comentario</p>
                            <p style="margin:0;font-size:14px;line-height:1.6;color:#1f2937;white-space:pre-wrap;">${observacionesHtml}</p>
                          </div>

                          <div style="margin:30px 0;text-align:center;">
                            <!--[if mso]>
                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                                href="${appUrl}"
                                style="height:48px;v-text-anchor:middle;width:240px;" arcsize="10%" strokecolor="#651930" fillcolor="#651930">
                                <w:anchorlock/>
                                <center style="color:#ffffff;font-family:sans-serif;font-size:18px;font-weight:500;">Ver Bitácora</center>
                              </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                              <a href="${appUrl}"
                                style="background-color:#651930;color:#ffffff;padding:14px 35px;font-size:18px;border-radius:8px;font-weight:500;text-decoration:none;display:inline-block;min-width:200px;">
                                Ver Bitácora
                              </a>
                            <!--<![endif]-->
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:45px;border-top:1px solid #e5e7eb;padding-top:25px;">
                      <tr>
                        <td style="font-size:15px;color:#6b7280;text-align:center;line-height:1.6;">
                          Sistema de Seguimiento de Temas · COMISIÓN ESTATAL DEL AGUA DE BAJA CALIFORNIA<br />
                          Este mensaje ha sido enviado automáticamente. Por favor, no responda a este correo.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <div class="outlook-only">&#8203;</div>
</body>
</html>`;
}

export function generateEmailDataNuevoAvance(
  email_to: string,
  empleadoNombre: string,
  appUrl: string,
  tituloTema: string,
  estado: string,
  capturadoPor: string,
  observaciones: string,
  fechaHora: Date | string,
  totalAdjuntos: number
): EmailData {
  return {
    email_to,
    email_subject: "📝 CEABC - Nuevo avance en un tema asignado",
    email_body: generateEmailBodyNuevoAvance(
      appUrl,
      empleadoNombre,
      tituloTema,
      estado,
      capturadoPor,
      observaciones,
      fechaHora,
      totalAdjuntos
    ),
    email_from: "sisco@ceabc.gob.mx",
    email_from_name: "Sistema de Seguimiento de Temas",
  };
}

export function generateEmailDataTemaAsignado(
  email_to: string,
  empleadoNombre: string,
  appUrl: string,
  tituloTema: string,
  descripcionTema: string,
  estado: string,
  departamentoOrigen: string,
  fechaLimite: Date | string | null,
  tipoInvolucrado: string,
  asignadoPor: string
): EmailData {
  return {
    email_to,
    email_subject: "🆕 CEABC - Se te ha asignado un nuevo tema",
    email_body: generateEmailBodyTemaAsignado(
      appUrl,
      empleadoNombre,
      tituloTema,
      descripcionTema,
      estado,
      departamentoOrigen,
      fechaLimite,
      tipoInvolucrado,
      asignadoPor
    ),
    email_from: "sisco@ceabc.gob.mx",
    email_from_name: "Sistema de Seguimiento de Temas",
  };
}

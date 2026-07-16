import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
  eventType: string;
  eventDate: string;
}

const bg     = '#0a0906';
const card   = '#1e1a15';
const amber  = '#c8922a';
const warm   = '#f0ede6';
const muted  = '#8a7d6b';
const border = 'rgba(200,146,42,0.20)';

export default function CateringConfirmation({ name, eventType, eventDate }: Props) {
  return (
    <Html>
      <Head />
      <Preview>We received your inquiry, {name}, we'll be in touch soon.</Preview>
      <Body style={{ background: bg, margin: 0, padding: '40px 0', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', background: card, borderRadius: 6, overflow: 'hidden', border: `1px solid ${border}` }}>

          {/* Amber top bar */}
          <Section style={{ background: amber, padding: '4px 0' }} />

          {/* Header */}
          <Section style={{ padding: '48px 40px 32px', textAlign: 'center' }}>
            <Text style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: amber }}>
              CAPOS COFFEE
            </Text>
            <Heading style={{ margin: '0 0 12px', fontSize: 32, fontWeight: 700, color: warm, letterSpacing: '-0.02em', lineHeight: '1.15' }}>
              We got your inquiry.
            </Heading>
            <Text style={{ margin: 0, fontSize: 15, color: muted, lineHeight: '1.7' }}>
              Thank you for reaching out, {name}. Our team will review your request and get back to you within 24–48 hours.
            </Text>
          </Section>

          <Hr style={{ borderColor: border, margin: '0 40px' }} />

          {/* Summary card */}
          <Section style={{ padding: '28px 40px' }}>
            <Text style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>
              Your Inquiry Summary
            </Text>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  ['Event Type', eventType],
                  ['Event Date', eventDate],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '10px 0', fontSize: 12, color: muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', width: '40%' }}>
                      {label}
                    </td>
                    <td style={{ padding: '10px 0', fontSize: 14, color: warm }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Message */}
          <Section style={{ padding: '8px 40px 40px' }}>
            <Text style={{ margin: 0, fontSize: 14, color: muted, lineHeight: '1.8', textAlign: 'center' }}>
              In the meantime, feel free to reply to this email with any questions. We look forward to bringing CAPOS to your event.
            </Text>
          </Section>

          {/* Tagline footer */}
          <Section style={{ padding: '20px 40px 28px', borderTop: `1px solid ${border}` }}>
            <Text style={{ margin: 0, fontSize: 12, color: muted, textAlign: 'center', fontStyle: 'italic' }}>
              "A marriage of cultures, one unforgettable cup at a time."
            </Text>
            <Text style={{ margin: '8px 0 0', fontSize: 11, color: muted, textAlign: 'center', letterSpacing: '0.12em' }}>
              hello@capos.coffee
            </Text>
          </Section>

          {/* Amber bottom bar */}
          <Section style={{ background: amber, padding: '3px 0' }} />
        </Container>
      </Body>
    </Html>
  );
}

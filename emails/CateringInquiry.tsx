import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Row, Column, Section, Text,
} from '@react-email/components';

interface Props {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guests: string;
  budget?: string;
  notes?: string;
}

const bg      = '#0a0906';
const card    = '#1e1a15';
const amber   = '#c8922a';
const warm    = '#f0ede6';
const muted   = '#8a7d6b';
const border  = 'rgba(200,146,42,0.20)';

export default function CateringInquiry({
  name, email, phone, eventType, eventDate, venue, guests, budget, notes,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>New catering inquiry from {name}: {eventType}</Preview>
      <Body style={{ background: bg, margin: 0, padding: '40px 0', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', background: card, borderRadius: 6, overflow: 'hidden', border: `1px solid ${border}` }}>

          {/* Amber top bar */}
          <Section style={{ background: amber, padding: '4px 0' }} />

          {/* Header */}
          <Section style={{ padding: '36px 40px 24px' }}>
            <Text style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: amber }}>
              CAPOS COFFEE
            </Text>
            <Heading style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 700, color: warm, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              New Catering Inquiry
            </Heading>
            <Text style={{ margin: '8px 0 0', fontSize: 13, color: muted }}>
              Submitted via capos.coffee
            </Text>
          </Section>

          <Hr style={{ borderColor: border, margin: '0 40px' }} />

          {/* Inquiry details */}
          <Section style={{ padding: '28px 40px' }}>

            <Row style={{ marginBottom: 20 }}>
              <Column>
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Name</Text>
                <Text style={{ margin: 0, fontSize: 16, color: warm, fontWeight: 600 }}>{name}</Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: 20 }}>
              <Column style={{ width: '50%', paddingRight: 12 }}>
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Email</Text>
                <Text style={{ margin: 0, fontSize: 14, color: warm }}>{email}</Text>
              </Column>
              <Column style={{ width: '50%', paddingLeft: 12 }}>
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Phone</Text>
                <Text style={{ margin: 0, fontSize: 14, color: warm }}>{phone}</Text>
              </Column>
            </Row>

            <Hr style={{ borderColor: border, margin: '8px 0 20px' }} />

            <Row style={{ marginBottom: 20 }}>
              <Column style={{ width: '50%', paddingRight: 12 }}>
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Event Type</Text>
                <Text style={{ margin: 0, fontSize: 14, color: warm }}>{eventType}</Text>
              </Column>
              <Column style={{ width: '50%', paddingLeft: 12 }}>
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Event Date</Text>
                <Text style={{ margin: 0, fontSize: 14, color: warm }}>{eventDate}</Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: 20 }}>
              <Column style={{ width: '50%', paddingRight: 12 }}>
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Venue / Location</Text>
                <Text style={{ margin: 0, fontSize: 14, color: warm }}>{venue}</Text>
              </Column>
              <Column style={{ width: '50%', paddingLeft: 12 }}>
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Expected Guests</Text>
                <Text style={{ margin: 0, fontSize: 14, color: warm }}>{guests}</Text>
              </Column>
            </Row>

            {budget && (
              <Row style={{ marginBottom: 20 }}>
                <Column>
                  <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Estimated Budget</Text>
                  <Text style={{ margin: 0, fontSize: 14, color: warm }}>{budget}</Text>
                </Column>
              </Row>
            )}

            {notes && (
              <>
                <Hr style={{ borderColor: border, margin: '8px 0 20px' }} />
                <Text style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>Additional Notes</Text>
                <Text style={{ margin: 0, fontSize: 14, color: warm, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{notes}</Text>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={{ padding: '20px 40px 32px', borderTop: `1px solid ${border}` }}>
            <Text style={{ margin: 0, fontSize: 12, color: muted, textAlign: 'center' }}>
              Reply directly to this email to contact {name} at {email}
            </Text>
          </Section>

          {/* Amber bottom bar */}
          <Section style={{ background: amber, padding: '3px 0' }} />
        </Container>

        <Text style={{ textAlign: 'center', fontSize: 11, color: muted, marginTop: 24 }}>
          CAPOS Coffee · A marriage of cultures, one unforgettable cup at a time.
        </Text>
      </Body>
    </Html>
  );
}

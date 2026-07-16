import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from '@react-email/components';

interface Props {
  email: string;
}

const bg     = '#0a0906';
const card   = '#1e1a15';
const amber  = '#c8922a';
const warm   = '#f0ede6';
const muted  = '#8a7d6b';
const border = 'rgba(200,146,42,0.20)';

export default function NewsletterWelcome({ email }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to CAPOS: stories from origin, straight to your inbox.</Preview>
      <Body style={{ background: bg, margin: 0, padding: '40px 0', fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', background: card, borderRadius: 6, overflow: 'hidden', border: `1px solid ${border}` }}>

          {/* Amber top bar */}
          <Section style={{ background: amber, padding: '4px 0' }} />

          {/* Header */}
          <Section style={{ padding: '52px 40px 36px', textAlign: 'center' }}>
            <Text style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: amber }}>
              CAPOS COFFEE
            </Text>

            {/* Large decorative letter */}
            <Text style={{ margin: '0 0 8px', fontSize: 72, fontWeight: 700, color: warm, lineHeight: 1, letterSpacing: '-0.04em' }}>
              C
            </Text>

            <Heading style={{ margin: '16px 0 12px', fontSize: 26, fontWeight: 700, color: warm, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              You&apos;re on the list.
            </Heading>
            <Text style={{ margin: 0, fontSize: 15, color: muted, lineHeight: '1.75', maxWidth: 420, display: 'block' }}>
              Welcome to Stories from Origin, our newsletter where we share brewing notes, pop-up announcements, and everything happening behind the cup.
            </Text>
          </Section>

          <Hr style={{ borderColor: border, margin: '0 40px' }} />

          {/* What to expect */}
          <Section style={{ padding: '28px 40px' }}>
            <Text style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: amber }}>
              What to Expect
            </Text>
            {[
              ['Pop-up announcements',    "Be the first to know when we're coming to your area."],
              ['Behind the cup',          "Stories about our coffees, origins, and the people behind them."],
              ['Exclusive event previews',"Early access to collaborations and special menus."],
            ].map(([title, desc]) => (
              <table key={title} style={{ width: '100%', marginBottom: 16 }}>
                <tbody>
                  <tr>
                    <td style={{ width: 6, paddingRight: 14, verticalAlign: 'top', paddingTop: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: amber, marginTop: 4 }} />
                    </td>
                    <td>
                      <Text style={{ margin: 0, fontSize: 14, color: warm, fontWeight: 600 }}>{title}</Text>
                      <Text style={{ margin: '3px 0 0', fontSize: 13, color: muted, lineHeight: '1.6' }}>{desc}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          </Section>

          {/* Tagline footer */}
          <Section style={{ padding: '20px 40px 28px', borderTop: `1px solid ${border}` }}>
            <Text style={{ margin: 0, fontSize: 12, color: muted, textAlign: 'center', fontStyle: 'italic' }}>
              "A marriage of cultures, one unforgettable cup at a time."
            </Text>
            <Text style={{ margin: '8px 0 0', fontSize: 11, color: muted, textAlign: 'center', letterSpacing: '0.12em' }}>
              {email} · hello@capos.coffee
            </Text>
          </Section>

          {/* Amber bottom bar */}
          <Section style={{ background: amber, padding: '3px 0' }} />
        </Container>

        <Text style={{ textAlign: 'center', fontSize: 11, color: muted, marginTop: 20 }}>
          You&apos;re receiving this because you signed up at capos.coffee
        </Text>
      </Body>
    </Html>
  );
}

import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your MaskMind Account</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your MaskMind verification code is {otp}</Preview>
      <Section style={{ backgroundColor: '#f7f4ee', padding: '32px 0' }}>
        <Section
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5ded4',
            padding: '28px',
          }}
        >
          <Row>
            <Heading as="h2" style={{ margin: '0 0 6px', fontSize: '22px' }}>
              Verify your email
            </Heading>
          </Row>
          <Row>
            <Text style={{ margin: '0 0 16px', color: '#5a534a', fontSize: '14px' }}>
              Hi {username}, thanks for creating your MaskMind account. Use the
              code below to finish verification.
            </Text>
          </Row>
          <Row>
            <Section
              style={{
                backgroundColor: '#f1e6d0',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid #e5ded4',
              }}
            >
              <Text
                style={{
                  margin: '0',
                  fontSize: '28px',
                  letterSpacing: '6px',
                  fontWeight: 700,
                  color: '#1b1b1b',
                }}
              >
                {otp}
              </Text>
            </Section>
          </Row>
          <Row>
            <Text style={{ margin: '16px 0 0', color: '#5a534a', fontSize: '12px' }}>
              This code expires in 60 minutes. If you didn&apos;t request this,
              you can safely ignore this email.
            </Text>
          </Row>
        </Section>
      </Section>
    </Html>
  );
}

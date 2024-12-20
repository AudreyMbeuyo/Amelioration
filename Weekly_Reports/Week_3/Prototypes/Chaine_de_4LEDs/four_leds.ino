// C++ code
//
#define LED1 2
#define LED2 4
#define LED3 7
#define LED4 8

void setup()
{
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);

}

void loop()
{
  digitalWrite(LED1, HIGH);
  digitalWrite(LED2, HIGH);
  delay(1000); // Wait for 1000 millisecond(s)
  digitalWrite(LED1, LOW);
  delay(1000); // Wait for 1000 millisecond(s)
  digitalWrite(LED2, LOW);
  digitalWrite(LED3, HIGH);
  delay(1000); // Wait for 1000 millisecond(s)
  digitalWrite(LED3, LOW);
  digitalWrite(LED4, HIGH);
  delay(1000); // Wait for 1000 millisecond(s)
  digitalWrite(LED4, LOW);
}
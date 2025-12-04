DROP SCHEMA IF EXISTS envia_invoice;

CREATE SCHEMA envia_invoice;

CREATE TABLE envia_invoice.invoices(
  id varchar(50) not null primary key,
  number int not null unique,
  value float not null,
  invoice_date date not null,
  payee_name text,
  payee_address text,
  payee_city_state text,
  payee_country text,
  payer_name text,
  payer_address text,
  payer_contact_name text,
  payer_email text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
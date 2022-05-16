CREATE SEQUENCE IF NOT EXISTS untitled_table_204_id_seq;

CREATE TABLE "public"."cheeses" (
    "id" int4 NOT NULL DEFAULT nextval('untitled_table_204_id_seq'::regclass),
    "name" varchar NOT NULL,
    "subtitle" varchar NOT NULL,
    "description" text NOT NULL,
    "pound" varchar NOT NULL,
    "milk" varchar NOT NULL,
    "refining" varchar NOT NULL,
    "pate" varchar NOT NULL,
    "wine" varchar NOT NULL,
    "img" varchar NOT NULL,
    "price" int4 NOT NULL,
    PRIMARY KEY ("id")
);

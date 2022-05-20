CREATE SEQUENCE IF NOT EXISTS untitled_table_198_id_seq;

CREATE TABLE "public"."recipes" (
    "id" int4 NOT NULL DEFAULT nextval('untitled_table_198_id_seq'::regclass),
    "name" varchar NOT NULL,
    "nbrpers" int4 NOT NULL,
    "difficult" int4 NOT NULL,
    "time" int4 NOT NULL,
    "cook" int4 NOT NULL,
    "ingredients" text NOT NULL,
    "steps" text NOT NULL,
    "cheese_name" varchar NOT NULL,
    "img" varchar NOT NULL,
    PRIMARY KEY ("id")
);

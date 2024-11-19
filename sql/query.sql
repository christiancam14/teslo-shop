-- public.roles definition
-- Drop table
-- DROP TABLE public.roles;
CREATE TABLE public.roles (
    id serial4 NOT NULL,
    "name" varchar(50) NOT NULL,
    CONSTRAINT roles_name_key UNIQUE (name),
    CONSTRAINT roles_pkey PRIMARY KEY (id)
);
-- public.users definition
-- Drop table
-- DROP TABLE public.users;
CREATE TABLE public.users (
    id serial4 NOT NULL,
    "name" varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    phone varchar(20) NULL,
    address varchar(255) NULL,
    registration_date timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    status bool DEFAULT true NULL,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
-- public.cart definition
-- Drop table
-- DROP TABLE public.cart;
CREATE TABLE public.cart (
    id serial4 NOT NULL,
    user_id int4 NULL,
    creation_date timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT cart_pkey PRIMARY KEY (id),
    CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
-- public.orders definition
-- Drop table
-- DROP TABLE public.orders;
CREATE TABLE public.orders (
    id serial4 NOT NULL,
    user_id int4 NULL,
    cart_id int4 NULL,
    status varchar(50) DEFAULT 'Pending'::character varying NULL,
    shipping_address varchar(255) NULL,
    order_date timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    admin_comment text NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
-- public.payments definition
-- Drop table
-- DROP TABLE public.payments;
CREATE TABLE public.payments (
    id serial4 NOT NULL,
    order_id int4 NULL,
    amount numeric(10, 2) NOT NULL,
    payment_method varchar(50) NULL,
    payment_date timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    status varchar(50) DEFAULT 'Pending'::character varying NULL,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
-- public.pets definition
-- Drop table
-- DROP TABLE public.pets;
CREATE TABLE public.pets (
    id serial4 NOT NULL,
    user_id int4 NULL,
    "name" varchar(255) NOT NULL,
    breed varchar(255) NULL,
    "size" varchar(50) NULL,
    color varchar(100) NULL,
    age int4 NULL,
    photos _text NULL,
    qr_code varchar(255) NULL,
    contact_info varchar(255) NULL,
    creation_date timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    qr_status bool DEFAULT true NULL,
    CONSTRAINT pets_pkey PRIMARY KEY (id),
    CONSTRAINT pets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
-- public.tags definition
-- Drop table
-- DROP TABLE public.tags;
CREATE TABLE public.tags (
    id serial4 NOT NULL,
    pet_id int4 NULL,
    qr_code varchar(255) NULL,
    description varchar(255) NULL,
    quantity int4 NULL,
    CONSTRAINT tags_pkey PRIMARY KEY (id),
    CONSTRAINT tags_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets(id)
);
-- public.user_roles definition
-- Drop table
-- DROP TABLE public.user_roles;
CREATE TABLE public.user_roles (
    id serial4 NOT NULL,
    user_id int4 NULL,
    role_id int4 NULL,
    CONSTRAINT user_roles_pkey PRIMARY KEY (id),
    CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
    CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
-- public.cart_items definition
-- Drop table
-- DROP TABLE public.cart_items;
CREATE TABLE public.cart_items (
    id serial4 NOT NULL,
    cart_id int4 NULL,
    tag_id int4 NULL,
    quantity int4 NULL,
    CONSTRAINT cart_items_pkey PRIMARY KEY (id),
    CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id),
    CONSTRAINT cart_items_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);

-- Create Scripts

CREATE TABLE User (
	email varchar(255) PRIMARY KEY,
	b_date date,
	user_role varchar(255) NOT NULL,
	user_status varchar(255) NOT NULL,
	user_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	phone varchar(255) 
);

CREATE TABLE Passwords (
	email varchar(255) FOREIGN KEY REFERENCES User(email),
	passwords varchar(255) NOT NULL
);

CREATE TABLE Amenities (
	id int PRIMARY KEY,
	amenitie_name varchar(255) NOT NULL,
	price decimal NOT NULL
);

CREATE TABLE Reservation (
	id int PRIMARY KEY, 
	reservation_status varchar(255) NOT NULL,
	email varchar(255) FOREIGN KEY REFERENCES User(email),
	check_in date NOT NULL,
	check_out date NOT NULL
);

CREATE TABLE Room (
	id int PRIMARY KEY,
	no_beds int NOT NULL,
	max_guests int,
	room_type varchar(255) NOT NULL,
	price decimal NOT NULL, 
	amount int,
	is_available bit NOT NULL
);

CREATE TABLE PaymentMethod (
	id int PRIMARY KEY,
	email varchar(255) FOREIGN KEY REFERENCES User(email)
);

CREATE TABLE Transfer (
	id int PRIMARY KEY REFERENCES PaymentMethod(id),
	acount_num int NOT NULL,
	user_name varchar(255) NOT NULL
);

CREATE TABLE Card (
	id int PRIMARY KEY REFERENCES PaymentMethod(id),
	card_num int NOT NULL,
	cardholder varchar(255) NOT NULL,
	cvv_code int NOT NULL
);

CREATE TABLE Recipt (
	id int PRIMARY KEY,
	recipt_date date NOT NULL,
	total_pay decimal NOT NULL,
	reservation_id int FOREIGN KEY REFERENCES Reservation(id),
	email varchar(255) FOREIGN KEY REFERENCES User(email),
	pay_method_id int FOREIGN KEY REFERENCES PaymentMethod(id)
);

CREATE TABLE AmenitiesXReservation (
	service_id int FOREIGN KEY REFERENCES Amenities(id),
	reservation_id int FOREIGN KEY REFERENCES Reservation(id)
);

CREATE TABLE RoomXReservation (
	room_id int FOREIGN KEY REFERENCES Room(id),
	reservation_id int FOREIGN KEY REFERENCES Reservation(id)
);


CREATE TABLE PaymentHistory (
	id int PRIMARY KEY,
	reservation_id int FOREIGN KEY REFERENCES Reservation(id),
	recipt_id int FOREIGN KEY REFERENCES Recipt(id),
	payment_date datetime
);

-- Insert Script

INSERT INTO User (email, b_date, user_role, user_status, user_name, last_name, phone) 
VALUES  ('hector.ramirez@gmail.com','1985-03-06','Administrador','Activo','Hector','Ramirez',89449354),
		('ignacio.perez@gmail.com','1999-09-18','Empleado','Activo','Ignacio','Perez',83466584),
		('ana.esquivel@gmail.com','1980-03-27','Cliente','Activo','Ana','Esquivel',86321055),
		('juan.jimenez@gmail.com','1990-05-20','Cliente','Activo','Juan','Jimenez',82246064);


INSERT INTO Amenities (id,amenitie_name,price) VALUES (201,'Spa',10);

INSERT INTO Room(id,no_beds,max_guests,room_type,price,amount)
VALUES  (301,1,2,'Suite Oceanfront',550,2),
		(302,1,2,'Bungalow',400,2),
		(303,1,2,'Vista Jardin 1',300,1),
		(304,2,2,'Vista Jardin 2',300,1),
		(305,3,4,'Suite Familiar',250,3),
		(306,1,2,'Estandar 1',150,2),
		(307,2,2,'Estandar 2',150,2);

INSERT INTO Reservation (id,reservation_status,email,check_in,check_out) 
VALUES  (401,'Abierta','ana.esquivel@gmail.com','2024-05-10','2024-05-16'),
		(402,'Cerrada','juan.jimenez@gmail.com','2024-03-05','2024-03-08');

INSERT INTO PaymentMethod (id,email) 
VALUES  (501,'ana.esquivel@gmail.com'),
		(502,'juan.jimenez@gmail.com');

INSERT INTO Transfer (id,acount_num,user_name)
VALUES	(501,123456,'Ana Esquivel'),
		(502,234567,'Juan Jimenez');

INSERT INTO Card(id,card_num,cardholder,cvv_code) 
VALUES	(501,1234,'Ana Esquivel',123),
		(502,2345,'Juan Jimenez',234);

INSERT INTO AmenitiesXReservation (service_id,reservation_id)
VALUES	(201,401);

INSERT INTO RoomXReservation (reservation_id,room_id)
VALUES	(401,302),
		(401,303),
		(402,306);

INSERT INTO Recipt (id,recipt_date,total_pay,reservation_id,email,pay_method_id) 
VALUES	(601,'2024-03-05',150,402,'juan.jimenez@gmail.com',502);

INSERT INTO PaymentHistory (id,reservation_id,recipt_id,payment_date)
VALUES (701,402,601,'05/03/24 08:56:32');


			
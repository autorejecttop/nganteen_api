# Pattern yang digunakan

## Dependency Injection

_NestJS_ menggunakan _design pattern dependency secara default_ untuk memudahkan dalam meng-_import_ berbagai macam _service_ yang ada. Hal tersebut memungkinkan saya untuk me-_reuse code_ saya dan tidak perlu melakukan duplikasi. Hal tersebut juga memberikan kemudahan dalam _refactoring_ dikarenakan adanya abstraksi terhadap implementasi dari _service_ yang saya gunakan.

## Repository Pattern

Dalam _project_ ini saya menggunakan _TypeORM_ dengan Repository pattern. Hal tersebut memudahkan saya dalam berinteraksi dengan _Entity_ yang telah saya buat dan properti-propertinya.

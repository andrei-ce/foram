# Forum app (DDD)

App developed using domain driven design principles.

> "The structure and language of the code should match that of the business domain"
>> **ERIC EVANS**

## Main topics studies during the project

- **Ubiqutous language**: in the discovery process, it is important to align language between all stakeholders (e.g. business, domain, tech & other experts)
- **Domain Experts**: business area experts, source of understanding the problem in details (e.g. mechanic)
- **Value objects**: immutable objects that express business rules (e.g. purple holds rgb values and if another color has the same values, then it is purple too. If rgb changes, then it's another color)
- **Entities**: unique intance of a model/class/entity that hold mutable values  (e.g. a tire can have the same specs of the other 3, but they are still different tires. Their values can change)
- **Domain events**: significant past state changes within a domain, which are important that domain experts know (e.g. tirePumped -> a change in the pressure var of one of the tires)
- **Aggregates / Aggregate root**: a cluster/entity of value objects, entities and domain events which have valid states defined by business rules (e.g. a Car must have this number of wheels). All calls from outside must come through this entity (e.g. a driver drives a Car, not a steering wheel, shift, accelerator and brakes)
- **Repositories**: the place where we persist the valid state of an Aggregate


- **Use cases**: application services
- **Subdomains**: (Bounded Contexts)


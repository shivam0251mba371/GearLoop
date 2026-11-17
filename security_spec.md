# GearLoop Firestore Security Specification

## 1. Data Invariants
1. **User PII Isolation**: A user document at `/users/{uid}` contains PII (`email`, `phone`, `upiId`) and can only be read (`get`), created, or updated by the authenticated owner (`request.auth.uid == uid`) with a verified email. Listing all `/users` is strictly denied.
2. **Vehicle Fleet Integrity**: A vehicle document at `/vehicles/{vehicleId}` must conform to valid `type`, `status`, and bounded string sizes. Updates are restricted strictly to `status`, `currentHub`, and `batteryPercent` while `vehicleId` remains immutable.
3. **Rental Ownership & Lifecycle**: A rental at `/rentals/{rentalId}` cannot exist without an existing `vehicleId` in `/vehicles`, must belong to `request.auth.uid` on creation, can only be read/listed by its owner (`resource.data.userId == request.auth.uid`), and locks permanently once `endTime` is populated (terminal state).
4. **Marketplace Escrow State Machine**: Listings at `/marketplace_items/{itemId}` cannot contain seller email PII, must start in `AVAILABLE` with `isEscrowHeld == false`, transition `AVAILABLE -> ESCROW_PENDING` when a buyer locks escrow, and lock permanently upon reaching `SOLD`.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated User Create**: Creating `/users/u1` without `request.auth`.
2. **Cross-User PII Read**: Authenticated user `u2` attempting `get(/users/u1)`.
3. **Users Collection Scrape**: Authenticated user attempting `list(/users)`.
4. **UID Spoofing on Rental**: User `u2` creating `/rentals/r1` with `userId: "u1"`.
5. **Orphaned Rental Creation**: Creating `/rentals/r1` referencing nonexistent `vehicleId: "FAKE-999"`.
6. **Terminal Rental Mutation**: Updating a rental whose `endTime` is already non-null.
7. **Shadow Ghost Field on User Update**: Updating `/users/u1` with an extra undeclared field `isAdmin: true`.
8. **ID Poisoning**: Creating `/marketplace_items/` with a 500-character invalid ID containing spaces/symbols.
9. **Array Overflow on Marketplace Images**: Creating a listing with >5 image URLs or non-string array element.
10. **Price/Escrow Manipulation on Escrow Lock**: Buyer locking escrow while changing `price` from 3800 to 1.
11. **Sold Item Re-opening**: Attempting to transition a `SOLD` marketplace item back to `AVAILABLE`.
12. **Unrelated User Cancelling Escrow**: Third-party user `u3` cancelling escrow held by `u2` on `u1`'s listing.

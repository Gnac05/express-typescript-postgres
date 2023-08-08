/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  TransactionStartEvent,
  TransactionCommitEvent,
  TransactionRollbackEvent,
} from 'typeorm';
import { RecoverEvent } from 'typeorm/subscriber/event/RecoverEvent';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';
import { Token } from '../entities/token.entity';

/**
 * I am the listen of the Token's TypeOrm entity model's events.
 *
 * I am responsible to listen to the Token's TypeOrm entity model's events.
 *
 * When an event (db operations) is triggered, I will execute the appropriate method.
 *
 * @implements EntitySubscriberInterface
 */
@EventSubscriber()
export class TokenSubscriber implements EntitySubscriberInterface<Token> {
  /**
   * Indicates that this subscriber only listen to Token events.
   */
  listenTo() {
    return Token;
  }

  /**
   * Called after entity is loaded.
   */
  afterLoad(entity: any) {
    console.log(`AFTER ENTITY LOADED: `, entity);
  }

  /**
   * Called before token insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    console.log(`BEFORE TOKEN INSERTED: `, event.entity);
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<any>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
  }

  /**
   * Called before entity update.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    console.log(`BEFORE ENTITY UPDATED: `, event.entity);
  }

  /**
   * Called after entity update.
   */
  afterUpdate(event: UpdateEvent<any>) {
    console.log(`AFTER ENTITY UPDATED: `, event.entity);
  }

  /**
   * Called before entity removal.
   */
  beforeRemove(event: RemoveEvent<any>) {
    console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
  }

  /**
   * Called after entity removal.
   */
  afterRemove(event: RemoveEvent<any>) {
    console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
  }

  /**
   * Called before entity removal.
   */
  beforeSoftRemove(event: SoftRemoveEvent<any>) {
    console.log(`BEFORE ENTITY WITH ID ${event.entityId} SOFT REMOVED: `, event.entity);
  }

  /**
   * Called after entity removal.
   */
  afterSoftRemove(event: SoftRemoveEvent<any>) {
    console.log(`AFTER ENTITY WITH ID ${event.entityId} SOFT REMOVED: `, event.entity);
  }

  /**
   * Called before entity recovery.
   */
  beforeRecover(event: RecoverEvent<any>) {
    console.log(`BEFORE ENTITY WITH ID ${event.entityId} RECOVERED: `, event.entity);
  }

  /**
   * Called after entity recovery.
   */
  afterRecover(event: RecoverEvent<any>) {
    console.log(`AFTER ENTITY WITH ID ${event.entityId} RECOVERED: `, event.entity);
  }

  /**
   * Called before transaction start.
   */
  beforeTransactionStart(event: TransactionStartEvent) {
    console.log(`BEFORE TRANSACTION STARTED: `);
  }

  /**
   * Called after transaction start.
   */
  afterTransactionStart(event: TransactionStartEvent) {
    console.log(`AFTER TRANSACTION STARTED: `);
  }

  /**
   * Called before transaction commit.
   */
  beforeTransactionCommit(event: TransactionCommitEvent) {
    console.log(`BEFORE TRANSACTION COMMITTED: `);
  }

  /**
   * Called after transaction commit.
   */
  afterTransactionCommit(event: TransactionCommitEvent) {
    console.log(`AFTER TRANSACTION COMMITTED: `);
  }

  /**
   * Called before transaction rollback.
   */
  beforeTransactionRollback(event: TransactionRollbackEvent) {
    console.log(`BEFORE TRANSACTION ROLLBACK: `);
  }

  /**
   * Called after transaction rollback.
   */
  afterTransactionRollback(event: TransactionRollbackEvent) {
    console.log(`AFTER TRANSACTION ROLLBACK: `);
  }
}

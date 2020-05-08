<?php

declare(strict_types=1);

namespace App\Application\Gate\Open;

use App\Domain\Gate\Gate;
use App\Domain\Gate\GateStorage;
use App\Domain\Gate\OpenFail;
use App\Domain\Gate\OpenSuccess;
use Sentry\SentryBundle\SentryBundle;
use function sprintf;
use Symfony\Component\Lock\LockFactory;
use Throwable;

final class OpenHandler
{
    private LockFactory $lockFactory;

    private Gate $gate;

    private GateStorage $storage;

    public function __construct(LockFactory $lockFactory, Gate $gate, GateStorage $storage)
    {
        $this->lockFactory = $lockFactory;
        $this->gate = $gate;
        $this->storage = $storage;
    }

    public function __invoke(OpenCommand $command): void
    {
        $lock = $this->lockFactory->createLock(__CLASS__, 3);

        if (!$lock->acquire()) {
            $this->storage->addFail(
                new OpenFail(
                    $command->requestId,
                    [
                        'message' => sprintf('%s already locked.', __CLASS__),
                    ]
                )
            );

            return;
        }

        try {
            $this->gate->open($command->requestId);

            $this->storage->addSuccess(
                new OpenSuccess($command->requestId)
            );
        } catch (Throwable $e) {
            SentryBundle::getCurrentHub()->captureException($e);

            $this->storage->addFail(
                new OpenFail(
                    $command->requestId,
                    [
                        'message' => $e->getMessage(),
                    ]
                )
            );
        } finally {
            $lock->release();
        }
    }
}

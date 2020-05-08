<?php

declare(strict_types=1);

namespace App\Application\Gate\Open;

use App\Domain\Gate\Gate;
use App\Domain\Gate\GateStorage;
use App\Domain\Gate\OpenFail;
use App\Domain\Gate\OpenSuccess;
use Sentry\SentryBundle\SentryBundle;
use Throwable;

final class OpenHandler
{
    private Gate $gate;

    private GateStorage $storage;

    public function __construct(Gate $gate, GateStorage $storage)
    {
        $this->gate = $gate;
        $this->storage = $storage;
    }

    public function __invoke(OpenCommand $command): void
    {
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
        }
    }
}

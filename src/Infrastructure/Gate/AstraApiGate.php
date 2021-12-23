<?php

declare(strict_types=1);

namespace App\Infrastructure\Gate;

use App\Domain\Gate\Gate;
use App\Domain\Gate\OpenRequestId;
use App\Domain\User\UserId;
use App\Domain\User\UserStorage;
use Ramsey\Uuid\UuidInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

final class AstraApiGate implements Gate
{
    public const SOUTH_GATE = '31a3b0ab-efda-4a1c-badb-6b29d4ace8f5';

    private HttpClientInterface $httpClient;
    private UserStorage $userStorage;

    public function __construct(HttpClientInterface $httpClient, UserStorage $userStorage)
    {
        $this->httpClient = $httpClient;
        $this->userStorage = $userStorage;
    }

    /**
     * @throws Throwable
     */
    public function open(OpenRequestId $requestId, UserId $userId, UuidInterface $gateId): void
    {
        $user = $this->userStorage->getById($userId);

        $this->httpClient->request('POST', '', [
            'timeout' => 2.5,
            'json' => [
                'gate' => $gateId->toString(),
                'user' => $user->getUsername(),
            ],
        ])->toArray();
    }
}

<?php

declare(strict_types=1);

namespace App\Infrastructure\Gate;

use App\Domain\Gate\Gate;
use App\Domain\Gate\OpenRequestId;
use App\Domain\User\UserId;
use App\Domain\User\UserStorage;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

final class AstraApiGate implements Gate
{
    private const SOUTH_GATE = '31a3b0ab-efda-4a1c-badb-6b29d4ace8f5';

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
    public function open(OpenRequestId $requestId, UserId $userId): void
    {
        $user = $this->userStorage->getById($userId);

        $this->httpClient->request('POST', '', [
            'timeout' => 2.5,
            'json' => [
                'query' => <<<'QUERY'
                    mutation openGate($gateId: uuid, $email: String) {
                        insert_gate_open_one(
                            object: { gate_id: $gateId, reason_id: "site", source: $email }
                        ) {
                            id
                        }
                    }
                    QUERY,
                'operationName' => 'openGate',
                'variables' => [
                    'gateId' => self::SOUTH_GATE,
                    'email' => $user->getUsername(),
                ],
            ],
        ])->toArray();
    }
}
